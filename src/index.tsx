import React, { useRef, useState, useCallback, useMemo } from 'react';
import { openFileDialog, getListFiles, getAcceptTypeString } from './utils';
import { getErrorValidation } from './validation';
import {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
} from './typings';
import {
  DEFAULT_NULL_INDEX,
  INIT_MAX_NUMBER,
  DEFAULT_DATA_URL_KEY,
} from './constants';

const ReactImageUploading: React.FC<ImageUploadingPropsType> = ({
  value = [],
  onChange,
  onError,
  children,
  dataURLKey = DEFAULT_DATA_URL_KEY,
  multiple = false,
  maxNumber = INIT_MAX_NUMBER,
  acceptType,
  maxFileSize,
  resolutionWidth,
  resolutionHeight,
  resolutionType,
  inputProps = {},
}) => {
  const inValue = value || [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyUpdate, setKeyUpdate] = useState<number>(DEFAULT_NULL_INDEX);
  const [errors, setErrors] = useState<ErrorsType>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleClickInput = useCallback(() => openFileDialog(inputRef), [
    inputRef,
  ]);

  const onImageUpload = useCallback((): void => {
    setKeyUpdate(DEFAULT_NULL_INDEX);
    handleClickInput();
  }, [handleClickInput]);

  const onImageRemoveAll = useCallback((): void => {
    onChange?.([]);
  }, [onChange]);

  const onImageRemove = (index: number | Array<number>): void => {
    const updatedList = [...inValue];
    if (Array.isArray(index)) {
      index.forEach((i) => {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    onChange?.(updatedList);
  };

  const onImageUpdate = (index: number): void => {
    setKeyUpdate(index);
    handleClickInput();
  };

  const validate = async (fileList: ImageListType): Promise<boolean> => {
    const errorsValidation = await getErrorValidation({
      fileList,
      maxFileSize,
      maxNumber,
      acceptType,
      keyUpdate,
      resolutionType,
      resolutionWidth,
      resolutionHeight,
      value: inValue,
    });
    if (errorsValidation) {
      setErrors(errorsValidation);
      onError?.(errorsValidation, fileList);
      return false;
    }
    errors && setErrors(null);
    return true;
  };

  const handleChange = async (files: FileList | null) => {
    if (!files) return;
    const fileList = await getListFiles(files, dataURLKey);
    if (!fileList.length) return;
    const checkValidate = await validate(fileList);
    if (!checkValidate) return;
    let updatedFileList: ImageListType;
    const updatedIndexes: number[] = [];
    if (keyUpdate > DEFAULT_NULL_INDEX) {
      const [firstFile] = fileList;
      updatedFileList = [...inValue];
      updatedFileList[keyUpdate] = firstFile;
      updatedIndexes.push(keyUpdate);
    } else if (multiple) {
      updatedFileList = [...inValue, ...fileList];
      for (
        let i = inValue.length as number;
        i < updatedFileList.length;
        i += 1
      ) {
        updatedIndexes.push(i);
      }
    } else {
      updatedFileList = [fileList[0]];
      updatedIndexes.push(0);
    }
    onChange?.(updatedFileList, updatedIndexes);
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    await handleChange(e.target.files);
    keyUpdate > DEFAULT_NULL_INDEX && setKeyUpdate(DEFAULT_NULL_INDEX);
    if (inputRef.current) inputRef.current.value = '';
  };

  const acceptTypeString = useMemo(() => getAcceptTypeString(acceptType), [
    acceptType,
  ]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      <input
        type="file"
        accept={acceptTypeString}
        ref={inputRef}
        multiple={multiple && keyUpdate === DEFAULT_NULL_INDEX}
        onChange={onInputChange}
        style={{ display: 'none' }}
        {...inputProps}
      />
      {children?.({
        imageList: inValue,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        errors,
        dragProps: {
          onDrop: handleDrop,
          onDragEnter: handleDragIn,
          onDragLeave: handleDragOut,
          onDragOver: handleDrag,
        },
        isDragging,
      })}
    </>
  );
};

export default ReactImageUploading;

export {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
};
