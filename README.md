# react-images-uploading

<div align="center">
  <img src="https://user-images.githubusercontent.com/6290720/91559755-9d6e8c00-e973-11ea-9bde-4b60c89f441a.png" width="250" />
</div>

The simple images uploader applied `Render Props` pattern. (You can read more about this pattern [here](https://reactjs.org/docs/render-props.html)).

This approach allows you to fully control UI component and behaviours.

> See [the intro blog post](https://medium.com/@imvutoan/make-image-upload-in-react-easier-with-react-images-uploading-and-your-ui-983fed029ee2)

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) ![Github_Actions](https://github.com/vutoan266/react-images-uploading/workflows/CI/CD/badge.svg) [![NPM](https://img.shields.io/npm/v/react-images-uploading.svg)](https://www.npmjs.com/package/react-images-uploading) [![NPM](https://img.shields.io/npm/dm/react-images-uploading.svg)](https://www.npmjs.com/package/react-images-uploading) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vutoan266/react-images-uploading/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/vutoan266/react-images-uploading/pulls) [![Package Quality](https://npm.packagequality.com/shield/react-images-uploading.svg)](https://packagequality.com/#?package=react-images-uploading) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Package Quality](https://npm.packagequality.com/badge/react-images-uploading.png)](https://packagequality.com/#?package=react-images-uploading)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
  - [Note](#note)
- [Exported options](#exported-options)
- [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

**npm**

```bash
npm install --save react-images-uploading
```

**yarn**

```bash
yarn add react-images-uploading
```

## Usage

You can check out the basic demo here:

- Javascript: [https://codesandbox.io/s/react-images-uploading-demo-u0khz](https://codesandbox.io/s/react-images-uploading-demo-u0khz)
- Typescript: [https://codesandbox.io/s/react-images-uploading-demo-typescript-fr2zm](https://codesandbox.io/s/react-images-uploading-demo-typescript-fr2zm)
- Server Side rendering (NextJS): [https://codesandbox.io/s/react-images-uploading-ssr-j1qq2](https://codesandbox.io/s/react-images-uploading-ssr-j1qq2)

**Basic**

```tsx
import React from 'react';
import ImageUploading from 'react-images-uploading';

export function App() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
```

**Validation**

```ts
...
  {({ imageList, onImageUpload, onImageRemoveAll, errors }) => (
    errors && <div>
      {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
      {errors.acceptType && <span>Your selected file type is not allow</span>}
      {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
      {errors.resolution && <span>Selected file is not match your desired resolution</span>}
    </div>
  )}
...
```

**Drag and Drop**

```tsx
...
  {({ imageList, dragProps, isDragging }) => (
    <div {...dragProps}>
      {isDragging ? "Drop here please" : "Upload space"}
      {imageList.map((image, index) => (
        <img key={index} src={image.data_url} />
      ))}
    </div>
  )}
...
```

## Props

| parameter        | type                                | options                                   | default | description                                                        |
| ---------------- | ----------------------------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------ |
| value            | array                               |                                           | []      | List of images                                                     |
| onChange         | function                            | (imageList, addUpdateIndex) => void       |         | Called when add, update or delete action is called                 |
| dataURLKey       | string                              |                                           | dataURL | Customized field name that base64 of selected image is assigned to |
| multiple         | boolean                             |                                           | false   | Set `true` for multiple chooses                                    |
| maxNumber        | number                              |                                           | 1000    | Number of images user can select if mode = `multiple`              |
| onError          | function                            | (errors, files) => void                   |         | Called when it has errors                                          |
| acceptType       | array                               | ['jpg', 'gif', 'png']                     | []      | The file extension(s) to upload                                    |
| maxFileSize      | number                              |                                           |         | Max image size (Byte) and it is used in validation                 |
| resolutionType   | string                              | 'absolute' \| 'less' \| 'more' \| 'ratio' |         | Using for image validation with provided width & height            |
| resolutionWidth  | number                              | > 0                                       |         |                                                                    |
| resolutionHeight | number                              | > 0                                       |         |                                                                    |
| inputProps       | React.HTMLProps\<HTMLInputElement\> |                                           |         |                                                                    |

### Note

**resolutionType**

| value    | description                                                              |
| :------- | :----------------------------------------------------------------------- |
| absolute | image's width === resolutionWidth && image's height === resolutionHeight |
| ratio    | (resolutionWidth / resolutionHeight) === (image width / image height)    |
| less     | image's width < resolutionWidth && image's height < resolutionHeight     |
| more     | image's width > resolutionWidth && image's height > resolutionHeight     |

## Exported options

| parameter        | type                                      | description                                                         |
| :--------------- | :---------------------------------------- | :------------------------------------------------------------------ |
| imageList        | array                                     | List of images to render.                                           |
| onImageUpload    | function                                  | Called when an element is clicks and triggers to open a file dialog |
| onImageRemoveAll | function                                  | Called when removing all images                                     |
| onImageUpdate    | (updateIndex: number) => void             | Called when updating an image at `updateIndex`.                     |
| onImageRemove    | (deleteIndex: number \| number[]) => void | Called when removing one or list image.                             |
| errors           | object                                    | Exported object of validation                                       |
| dragProps        | object                                    | Native element props for drag and drop feature                      |
| isDragging       | boolean                                   | "true" if an image is being dragged                                 |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://medium.com/@imvutoan"><img src="https://avatars1.githubusercontent.com/u/18349710?v=4" width="100px;" alt=""/><br /><sub><b>vutoan266</b></sub></a><br /><a href="https://github.com/vutoan266/react-images-uploading/commits?author=vutoan266" title="Code">💻</a> <a href="#ideas-vutoan266" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/vutoan266/react-images-uploading/commits?author=vutoan266" title="Documentation">📖</a> <a href="#maintenance-vutoan266" title="Maintenance">🚧</a> <a href="https://github.com/vutoan266/react-images-uploading/commits?author=vutoan266" title="Tests">⚠️</a> <a href="https://github.com/vutoan266/react-images-uploading/pulls?q=is%3Apr+reviewed-by%3Avutoan266" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://www.dzungnguyen.dev/about"><img src="https://avatars3.githubusercontent.com/u/6290720?v=4" width="100px;" alt=""/><br /><sub><b>David Nguyen</b></sub></a><br /><a href="https://github.com/vutoan266/react-images-uploading/commits?author=davidnguyen179" title="Code">💻</a> <a href="#ideas-davidnguyen179" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/vutoan266/react-images-uploading/commits?author=davidnguyen179" title="Documentation">📖</a> <a href="https://github.com/vutoan266/react-images-uploading/pulls?q=is%3Apr+reviewed-by%3Adavidnguyen179" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/conandk"><img src="https://avatars2.githubusercontent.com/u/12934183?v=4" width="100px;" alt=""/><br /><sub><b>DK</b></sub></a><br /><a href="https://github.com/vutoan266/react-images-uploading/commits?author=conandk" title="Code">💻</a> <a href="#infra-conandk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-conandk" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/vutoan266/react-images-uploading/pulls?q=is%3Apr+reviewed-by%3Aconandk" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/vutoan266/react-images-uploading/commits?author=conandk" title="Documentation">📖</a></td>
    <td align="center"><a href="https://masesisaac.me/"><img src="https://avatars2.githubusercontent.com/u/9384060?v=4" width="100px;" alt=""/><br /><sub><b>Isaac Maseruka</b></sub></a><br /><a href="https://github.com/vutoan266/react-images-uploading/commits?author=masesisaac" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
