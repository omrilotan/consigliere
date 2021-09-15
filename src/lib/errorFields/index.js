export const ERROR_FIELDS = [

  // Error native getters
  'message',
  'stack',
  'code',

  // inherited (not own property)
  'name',

  // non standard browser fields
  'fileName',
  'lineNumber',
  'columnNumber',

  // SystemError
  'address',
  'dest',
  'errno',
  'info',
  'path',
  'port',
  'syscall',

  // OpenSSL error properties
  'opensslErrorStack',
  'function',
  'library',
  'reason',

  // custom
  'details',
  'description'
]
