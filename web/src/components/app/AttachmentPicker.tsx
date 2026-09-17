"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ACCEPT_ATTRIBUTE, ATTACHMENT_FIELD, MAX_FILES_PER_MESSAGE, UPLOAD_ERRORS, UPLOAD_HINT, uploadProblem } from "@/features/attachments/rules";
import { formatBytes } from "@/lib/format";
import { Icon } from "./Icon";

const UPLOAD_URL = "/api/uploads";
const PERCENT = 100;
const HTTP_OK = 200;
const NETWORK_ERROR = "Bağlantı koptu, dosya yüklenemedi.";
const GENERIC_ERROR = "Dosya yüklenemedi.";

type Item = { key: number; name: string; size: number; progress: number; status: "uploading" | "done" | "error"; id?: string; error?: string };
type UploadResponse = { ok: true; id: string } | { ok: false; error: string };

type AttachmentPickerProps = {
  /** the ticket's company; required for staff uploads, ignored for customers */
  companyId?: string;
  onBusyChange: (busy: boolean) => void;
};

/**
 * Uploads files as soon as they are chosen or dropped, with per-file progress (XMLHttpRequest, since fetch reports no upload progress).
 * Finished uploads become hidden attachmentIds inputs of the surrounding form.
 */
export function AttachmentPicker({ companyId, onBusyChange }: AttachmentPickerProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextKey = useRef(0);
  const requests = useRef(new Map<number, XMLHttpRequest>());

  const busy = items.some((i) => i.status === "uploading");
  useEffect(() => onBusyChange(busy), [busy, onBusyChange]);
  useEffect(() => {
    const open = requests.current;
    return () => open.forEach((xhr) => xhr.abort());
  }, []);

  const patch = (key: number, changes: Partial<Item>) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...changes } : i)));

  function upload(key: number, file: File) {
    const xhr = new XMLHttpRequest();
    requests.current.set(key, xhr);
    const fail = (error: string) => patch(key, { status: "error", error });
    xhr.open("POST", companyId ? `${UPLOAD_URL}?firma=${encodeURIComponent(companyId)}` : UPLOAD_URL);
    xhr.responseType = "json";
    xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) patch(key, { progress: Math.round((e.loaded / e.total) * PERCENT) });
    };
    xhr.onload = () => {
      const response = xhr.response as UploadResponse | null;
      if (xhr.status === HTTP_OK && response?.ok) patch(key, { status: "done", progress: PERCENT, id: response.id });
      else fail(response && !response.ok ? response.error : GENERIC_ERROR);
    };
    xhr.onerror = () => fail(NETWORK_ERROR);
    xhr.onloadend = () => requests.current.delete(key);
    xhr.send(file);
  }

  function addFiles(files: File[]) {
    let slots = MAX_FILES_PER_MESSAGE - items.filter((i) => i.status !== "error").length;
    const added = files.map((file): [Item, File | null] => {
      const base = { key: nextKey.current++, name: file.name, size: file.size, progress: 0 };
      const problem = slots <= 0 ? UPLOAD_ERRORS.count : uploadProblem(file.name, file.type, file.size);
      if (problem) return [{ ...base, status: "error", error: problem }, null];
      slots -= 1;
      return [{ ...base, status: "uploading" }, file];
    });
    setItems((prev) => [...prev, ...added.map(([item]) => item)]);
    for (const [item, file] of added) if (file) upload(item.key, file);
  }

  const onChoose = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const remove = (key: number) => {
    requests.current.get(key)?.abort();
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  return (
    <div className="picker">
      <div
        className={`picker-drop${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <button className="btn btn-ghost btn-small" type="button" onClick={() => inputRef.current?.click()}>
          <Icon name="paperclip" size={16} />Dosya ekle
        </button>
        <small>{UPLOAD_HINT} Dosyaları buraya sürükleyip de bırakabilirsiniz.</small>
        <input ref={inputRef} className="sr-only" type="file" multiple accept={ACCEPT_ATTRIBUTE} onChange={onChoose} tabIndex={-1} aria-hidden="true" />
      </div>
      {items.length > 0 && (
        <ul className="picker-list">
          {items.map((item) => (
            <PickerRow key={item.key} item={item} onRemove={() => remove(item.key)} />
          ))}
        </ul>
      )}
      {items.map((item) => item.status === "done" && item.id && <input key={item.key} type="hidden" name={ATTACHMENT_FIELD} value={item.id} />)}
    </div>
  );
}

function PickerRow({ item, onRemove }: { item: Item; onRemove: () => void }) {
  return (
    <li className={`picker-item is-${item.status}`}>
      <Icon name={item.status === "done" ? "check" : "file"} size={16} />
      <span className="picker-main">
        <span className="picker-name">{item.name}</span>
        {item.status === "error" ? (
          <small className="field-error" role="alert">{item.error}</small>
        ) : (
          <small>
            {formatBytes(item.size)}
            {item.status === "uploading" && `, %${item.progress}`}
          </small>
        )}
        {item.status === "uploading" && <progress max={PERCENT} value={item.progress} aria-label={`${item.name} yükleniyor`} />}
      </span>
      <button className="icon-btn picker-remove" type="button" onClick={onRemove} aria-label={`${item.name} dosyasını kaldır`} title="Kaldır">
        <Icon name="close" size={16} />
      </button>
    </li>
  );
}
