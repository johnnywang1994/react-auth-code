import type { FunctionComponent, Dispatch, SetStateAction } from 'react'
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

const createArray = (len: number) => Array(len).fill('')

const IsOnlyNumber = (val: string) => /^[0-9]*$/.test(val)

export interface AuthCodeProps {
  placeholder?: string
  inputType?: string
  inputClassName?: string
  ariaLabel?: string
  autoFocus?: boolean // auto focus to first field when mounted
  autoComplete?: boolean // auto complete for first field
  autoReplace?: boolean // auto replace value with new value in field
  loop?: boolean // auto clear all fields, then put new value to first field after onComplete
  onlyNumber?: boolean // only allow 0-9 number
  validate?: (value: string) => boolean // custom validate function to check input value before onChange
  fields?: number // fields number
  renderInput?: (input: JSX.Element, i: number) => JSX.Element
  onFocus?: (e: React.FocusEvent<HTMLInputElement>, i: number) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>, i: number) => void
  onChange?: (codes: string[]) => void // each time value changed
  onComplete?: (codes: string[]) => void // once all joined value length match fields number
  [key: string]: any
}

export interface AuthCodeRef {
  getCodes: () => string[]
  getValue: () => string
  setCodes: Dispatch<SetStateAction<string[]>>
  setCode: (index: number, value: string) => void
  focus: (index?: number) => void
  clear: () => void
  getInput: (index?: number) => {
    value: HTMLInputElement | null
    next: HTMLInputElement | null
    prev: HTMLInputElement | null
  }
}

const AuthCode: FunctionComponent<AuthCodeProps> = forwardRef<AuthCodeRef, AuthCodeProps>((
  {
    placeholder,
    inputType = 'tel',
    inputClassName = '',
    ariaLabel,
    disabled = false,
    autoFocus = true,
    autoComplete = false,
    loop = false,
    onlyNumber = true,
    validate = () => true,
    fields = 6,
    renderInput = (input, i) => <label key={i}>{input}</label>,
    onFocus = () => {},
    onBlur = () => {},
    onChange = () => {},
    onComplete = () => {},
    ...props
  },
  authCodeRef,
) => {
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [codes, setCodes] = useState<string[]>(createArray(fields))

  const setNewCode = (index: number, newVal: string) => {
    setCodes((prevCodes) => {
      const newCodes = [...prevCodes]
      newCodes.splice(index, 1, newVal)
      return newCodes
    })
  }

  const clearCodes = () => {
    setCodes(createArray(fields))
  }

  const getInput = (index = 0) => {
    const refInput = inputsRef.current[index]
    return {
      value: refInput,
      next: index < fields - 1
        ? inputsRef.current[index + 1]
        : null,
      prev: index > 0
        ? inputsRef.current[index - 1]
        : null,
    }
  }

  useImperativeHandle(authCodeRef, () => ({
    getCodes: () => codes,
    getValue: () => codes.join(''),
    setCodes,
    setCode: setNewCode,
    focus: (index = 0) => {
      if (inputsRef.current)
        getInput(index).value.focus()
    },
    clear: () => {
      clearCodes()
    },
    getInput,
  }))

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    const eventTarget = e.target as HTMLInputElement
    const rawVal = eventTarget.value
    let newVal = rawVal
    if (onlyNumber && !IsOnlyNumber(newVal)) return
    if (!validate(newVal)) return

    const lastChar = newVal.slice(-1)
    const isLastCode = i === fields - 1
    if (newVal.length > 1) {
      newVal = lastChar
      if (isLastCode && loop && fields > 1) {
        clearCodes()
        setNewCode(0, lastChar)
        inputsRef.current[1].focus()
        return
      }
    }

    setNewCode(i, newVal)
    if (newVal.length)
      getInput(i).next?.focus()
    else
      getInput(i).prev?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    const { key } = e
    const eventTarget = e.target as HTMLInputElement
    if (key === 'Backspace') {
      if (eventTarget.value === '' && i > 0) {
        getInput(i).prev?.focus()
        setNewCode(i - 1, '')
        e.preventDefault()
      }
    }
  }

  const handleOnPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const pastedValue = e.clipboardData.getData('Text').slice(0, fields)
    for (let i = 0; i < pastedValue.length; i++) {
      const pastedCharacter = pastedValue.charAt(i)
      const currentValue = codes[i]
      if (validate(pastedCharacter) && !currentValue) {
        setNewCode(i, pastedCharacter)
        getInput(i).next?.focus()
      }
    }
    e.preventDefault()
  }

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>, i: number) => {
    e.target.select()
    onFocus(e, i)
  }

  useEffect(() => {
    onChange(codes)
    if (codes.join('').length === fields)
      onComplete(codes)
  }, [codes, onChange, onComplete])

  const inputs = []
  for (let i = 0; i < fields; i++) {
    const firstInput = i === 0
    const inputEl = (
      <input
        ref={(el: HTMLInputElement) => {
          inputsRef.current[i] = el
        }}
        type={inputType}
        className={inputClassName}
        value={codes[i]}
        placeholder={placeholder}
        aria-label={
          ariaLabel
            ? `${ariaLabel}. Code ${i + 1}.`
            : `Code ${i + 1}.`
        }
        disabled={disabled}
        autoFocus={autoFocus && firstInput}
        autoComplete={autoComplete && firstInput ? 'one-time-code' : 'off'}
        onChange={e => handleOnChange(e, i)}
        onKeyDown={e => handleKeyDown(e, i)}
        onPaste={e => handleOnPaste(e)}
        onBlur={e => onBlur(e, i)}
        onFocus={e => handleOnFocus(e, i)}
      />
    )
    inputs.push(renderInput(inputEl, i))
  }

  return (
    <div {...props}>{inputs}</div>
  )
})

export default AuthCode
