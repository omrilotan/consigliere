import { ERROR_FIELDS } from '../errorFields/index.js'

export function log (subject, enrichment = {}) {
  const record = {}

  if (typeof subject?.toJSON === 'function') {
    Object.assign(
      record,
      subject.toJSON()
    )
  } else if (subject instanceof Error) {
    Object.assign(
      record,
      { ...subject },
      ...ERROR_FIELDS.map(
        field => ({ [field]: subject[field] })
      )
    )
  } else if (Array.isArray(subject)) {
    Object.assign(
      record,
      { message: subject.join(', ') }
    )
  } else if (subject?.toString() === '[object Object]') {
    Object.assign(
      record,
      subject
    )
  } else {
    Object.assign(
      record,
      { message: `${subject}` }
    )
  }
  const output = JSON.stringify({
    ...enrichment,
    ...record,
    level: this.level
  }, normalise)
  return this.device(output)
}

function normalise (key, value) {
  if (!key) {
    return value
  }
  if ([null, undefined].includes(value)) {
    return value
  }
  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return value
  }
  if (value instanceof Date) {
    return value.toUTCString()
  }
  try {
    return `${value}`
  } catch (error) {}

  try {
    return value.toString()
  } catch (error) {}

  try {
    return JSON.stringify(value)
  } catch (error) {}

  return undefined
}
