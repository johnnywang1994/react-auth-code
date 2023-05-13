# React Auth Code
![two-factor-authentication](https://github.com/johnnywang1994/react-auth-code/assets/42905128/c9da2bba-65a5-42c6-88f0-33ac1ba9bec8)

React component for entering and validating PIN code. With highly customizable `renderInput` prop, adjusting UI/UX more easily.


## Install
```bash
$ npm install react-auth-code
# or
$ yarn add react-auth-code
```

## Usage
### Basic Usage
- `onChange`: trigger when codes changed.
- `onComplete`: trigger when codes length reach `fields` setting
```tsx
import AuthCode from 'react-auth-code';

const App = () => {
  const [codes, setCodes] = useState<string[]>();

  const handleOnChange = (newCodes: string[]) => {
    setCodes(newCodes);
  };

  const handleOnComplete = (newCodes: string[]) => {
    // ... do something with completed newCodes
  };

  return (
    <AuthCode
      onChange={handleOnChange}
      onComplete={handleOnComplete}
    />
  );
};

export default App;
```

### InputType & Validation
By default, `inputType` is `tel`, and only numbers `0-9` is allowed to be input. we can disable this by changing `onlyNumber` prop to `false`.

provide the custom `validate` function to validate the input value before changing value in each input field.

> `onlyNumber` and `validate` is checked seperately, and `onlyNumber` will be checked before `validate`, so you can use `onlyNumber`, `validate` in the same time.

```tsx
import { useState } from 'react';
import AuthCode from 'react-auth-code';

const App = () => {
  // ...
  return (
    <AuthCode
      inputType="tel"
      onlyNumber={false}
      // below same as "onlyNumber: true"
      validate={(newVal) => /^[0-9]*$/.test(val)}
    />
  );
};
```

### Focus
By default, the first input is auto focused when component mounted, and we can give the `onFocus`, `onBlur` method to sync `focus state`.

> disable auto focus feature by `autoFocus` prop.

```tsx
import { useState } from 'react';
import AuthCode from 'react-auth-code';

const App = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <AuthCode
      autoFocus={true}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(true)}
    />
  );
};
```

### Custom Input
By default, each input is wrapped with a `label`, we can change the wrapper with `renderInput` prop, and `inputClassName` to customize our input style.
```tsx
const App = () => {
  // ...
  return (
    <AuthCode
      inputClassName="w-5 text-4xl text-center p-0 pb-2"
      renderInput={(input, i) => (
        <label key={i} className="px-5">
          {input}
        </label>
      )}
    />
  );
};
```

### Loop
After entering all codes, the last input will be focused and new input code will by default, replace current field code.

If `loop` is set to `true`, the new input code will be auto moved to the first field, and the second field will be focused then. User would not have to manually touch the first field to input codes again.

> `loop` feature only take effect when `fields > 1`.
```tsx
const App = () => {
  // ...
  return (
    <AuthCode loop={true} />
  );
};
```

### Programming Reference
By passing a reference to `<AuthCode>`, we can call some useful methods like below.
```tsx
import { useRef } from 'react';
import AuthCode, { AuthCodeRef } from 'react-auth-code';

const App = () => {
  const authCodeRef = useRef<AuthCodeRef>(null);

  const clearCodes = () => {
    authCodeRef.current?.clear();
  };

  return (
    <AuthCode ref={authCodeRef} />
  );
};
```
#### available methods
|Method|Description|
|--|--|
|`clear(): void`|clear all input values|
|`focus(index: Number = 0): void`|focus input with given index|
|`getInput(index: Number = 0): InputDetail`|get input detail with given index|
|`getCodes(): String[]`|get codes in inputs|
|`getValue(): String`|get joined code string|
|`setCodes: Dispatch<SetStateAction<string[]>>`|react setState function of codes|
|`setCode(index: Number, value: String): void`|set code value with index|

```ts
interface InputDetail {
  value: HTMLInputElement | null
  next: HTMLInputElement | null
  prev: HTMLInputElement | null
}
```


## Props
|Prop|Type|Description|Default Value|Observations|
|--|--|--|--|--|
|autoFocus|Boolean|auto focus first input on mount|true||
|autoComplete|Boolean|enable auto complete with `one-time-code` in first input|false||
|autoReplace|Boolean|whether replace value for input already had value with last character|true||
|ariaLabel|String|Accessibility|||
|renderInput|(input: JSX.Element, index: Number) => JSX.Element|render function for each field item|`(input, i) => <label key={i}>{input}</label>`||
|disabled|Boolean|whether disable all inputs|false||
|fields|Number|number of inputs|6||
|inputType|String|input type|`tel`||
|inputClassName|String|input className|||
|loop|Boolean|whether auto focus to second input when input exceed fields length|false||
|onlyNumber|Boolean|only allow `0-9` number|true||
|onFocus|(e: ReactEvent, index: Number) => void|trigger when input focused|`() => {}`||
|onBlur|(e: ReactEvent, index: Number) => void|trigger when input blured|`() => {}`||
|onChange|(codes: String[]) => void|trigger when any value changed|`() => {}`||
|onComplete|(codes: String[]) => void|trigger when codes length reach fields number|`() => {}`||
|placeholder|String|input placeholder|||
|validate|(value: String) => Boolean|custom validate function for input value|`() => true`||


## License
Licensed under the MIT License, Copyright © 2023-present Johnny Wang [johnnywang1994](https://github.com/johnnywang1994).
