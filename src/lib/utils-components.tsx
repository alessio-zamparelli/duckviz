import { DataType, type Field } from 'apache-arrow'
import { CalendarClockIcon, CalendarIcon, FileQuestionIcon, HashIcon, TypeIcon } from 'lucide-react'

const tsTyped = {
  0: (v: unknown) => new Date(Number((v as bigint) * 1_000n)), // s
  1: (v: unknown) => new Date(Number(v as bigint)), // ms
  2: (v: unknown) => new Date(Number((v as bigint) / 1_000n)), // tz
  3: (v: unknown) => new Date(Number((v as bigint) / 1_000_000n)), // ns
}

export function Field2Typed(field?: Field) {
  if (DataType.isDate(field?.type))
    return {
      key: field.name,
      title: (
        <span className='inline-flex gap-1'>
          {field.name}
          <CalendarIcon />
        </span>
      ),
      formatter: (v: unknown) => new Date(v as number).toLocaleDateString(),
      typed: (v: unknown) => new Date(v as number),
    }

  if (DataType.isTimestamp(field?.type))
    return {
      key: field.name,
      title: (
        <span className='inline-flex gap-1'>
          {field.name}
          <CalendarClockIcon />
        </span>
      ),
      formatter: (v: unknown) => new Date(v as number).toLocaleString(),
      typed: tsTyped[field.type.unit],
    }

  if (DataType.isInt(field?.type) || DataType.isDecimal(field?.type) || DataType.isFloat(field?.type))
    return {
      key: field.name,
      title: (
        <span className='inline-flex gap-1'>
          {field.name}
          <HashIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => Number(v),
      typed: (v: unknown) => Number(v),
    }

  if (DataType.isUtf8(field?.type))
    return {
      key: field.name,
      title: (
        <span className='inline-flex gap-1'>
          {field.name}
          <TypeIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => v,
      typed: (v: unknown) => v,
    }

  console.log('[Field2Typed] unknown field datatype', field)
  return {
    key: field?.name,
    title: (
      <span className='inline-flex gap-1'>
        {field?.name}
        <FileQuestionIcon />
      </span>
    ), //`${field.name}${field.nullable && "?"}`,
    formatter: (v: unknown) => v,
    typed: (v: unknown) => v,
  }
}
