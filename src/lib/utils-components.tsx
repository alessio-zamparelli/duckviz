import { DataType, Field } from "apache-arrow"
import { CalendarClockIcon, CalendarIcon, FileQuestionIcon, HashIcon, TypeIcon } from "lucide-react"

export const Field2Typed = (field?: Field) => {
  if (DataType.isDate(field?.type)) {
    return {
      key: field.name,
      title: (
        <span className="inline-flex gap-1">
          {field.name}
          <CalendarIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => new Date(v as number).toLocaleDateString(),
      typed: (v: unknown) => new Date(v as number),
    }
  }
  if (DataType.isTimestamp(field?.type)) {
    return {
      key: field.name,
      title: (
        <span className="inline-flex gap-1">
          {field.name}
          <CalendarClockIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => new Date(v as number).toLocaleString(),
      typed: (v: unknown) => new Date(v as number),
    }
  }
  if (DataType.isInt(field?.type)) {
    // console.log("[Field2Typed] int ", field)
    return {
      key: field.name,
      title: (
        <span className="inline-flex gap-1">
          {field.name}
          <HashIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => Number(v),
      typed: (v: unknown) => Number(v),
    }
  }
  if (DataType.isDecimal(field?.type) || DataType.isFloat(field?.type)) {
    // console.log("[Field2Typed] int ", field)
    return {
      key: field.name,
      title: (
        <span className="inline-flex gap-1">
          {field.name}
          <HashIcon />,
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => Number(v),
      typed: (v: unknown) => Number(v),
    }
  }
  if (DataType.isUtf8(field?.type)) {
    return {
      key: field.name,
      title: (
        <span className="inline-flex gap-1">
          {field.name}
          <TypeIcon />
        </span>
      ), //`${field.name}${field.nullable && "?"}`,
      formatter: (v: unknown) => v,
      typed: (v: unknown) => v,
    }
  }

  console.log("[Field2Typed] unknown field datatype", field)
  return {
    key: field?.name,
    title: (
      <span className="inline-flex gap-1">
        {field?.name}
        <FileQuestionIcon />
      </span>
    ), //`${field.name}${field.nullable && "?"}`,
    formatter: (v: unknown) => v,
    typed: (v: unknown) => v,
  }
}