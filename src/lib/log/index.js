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
  })
  return this.device(output)
}
