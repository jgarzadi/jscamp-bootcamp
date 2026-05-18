import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Aquí irá el código

// Directorio a listar
const dir = process.argv[2] ?? '.'

// Formatear el tamaño de los archivos
const formatSize = (size) => {
    if (size < 1024) return `${size} B`
    return `${(size / 1024).toFixed(2)} KB`
}

// Leer nombre de archivos
const files = await readdir(dir)

// Obtener información de cada archivo
const entries = await Promise.all(
    files.map(async (name) => {
        const fullPath = join(dir, name)
        const info = await stat(fullPath)

        return {
            name,
            size: formatSize(info.size),
            isDir: info.isDirectory()
        }
    })
)

for (const entry of entries) {
    const icon = entry.isDir ? '📁' : '📄'
    const size = entry.isDir ? '-' : ` ${entry.size}`
    console.log(`${icon} ${entry.name.padEnd(20)}${size}`)
}