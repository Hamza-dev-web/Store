"use client"
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, FileUploadRemoveEvent, FileUploadProps } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Toast as ToastRef } from 'primereact/toast';
import { ContextValue } from '@/context/context';

interface UploadedFile {
    name: string;
    objectURL: string;
    size: number;
}
/*

import {useDropzone} from 'react-dropzone';

export default function Basic() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [previews, setPreviews] = useState([]);  
  const files = acceptedFiles.map(file => {


});


  useEffect(() => {
    const newPreviews = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);


    return () => newPreviews.forEach(p => URL.revokeObjectURL(p.preview));
  }, [acceptedFiles]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
  
      </aside>
    </section>
  );
}

*/
export default function TemplateDemo() {
    const toast = useRef<ToastRef | null>(null);
    const [totalSize, setTotalSize] = useState<number>(0);
    const fileUploadRef = useRef<FileUpload | null>(null);
    // @ts-ignore
    const {setAvatar, avatar} = useContext(ContextValue)
    console.log(fileUploadRef.current?.getFiles()[0]?.objectURL)
useEffect(()=>{
  if(fileUploadRef.current?.getFiles()[0]?.objectURL){
setAvatar(fileUploadRef.current?.getFiles()[0]?.objectURL)
  }
},[fileUploadRef.current?.getFiles()[0]?.objectURL])
    const onTemplateSelect = (e: FileUploadSelectEvent): void => {
        let _totalSize = totalSize;
        const files = e.files;

        Object.keys(files).forEach((key :any) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent): void => {
        let _totalSize = 0;

        e.files.forEach((file :File | any) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file: UploadedFile | any, callback: () => void): void => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = (): void => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formattedValue = fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formattedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
                </div>
            </div>
        );
    };

    const itemTemplate = (file: UploadedFile | any, props: any)=> {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i
                    className="pi pi-image mt-3 p-5"
                    style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}
                ></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions: FileUploadProps['chooseOptions'] = {
        icon: 'pi pi-fw pi-images',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };

    const uploadOptions: FileUploadProps['uploadOptions'] = {
        icon: 'pi pi-fw pi-cloud-upload',
        iconOnly: true,
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
    };

    const cancelOptions: FileUploadProps['cancelOptions'] = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
    };

    return (
        <div>
            <Toast ref={toast} />

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                url="/api/upload"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                // @ts-ignore
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    );
}
    
