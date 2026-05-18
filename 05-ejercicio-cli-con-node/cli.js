import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Aquí irá el código

// Directorio a listar , lee parametros desde la línea de comandos y remueve los que tengan -- o -
const dir = process.argv.slice(2).find(arg => !arg.startsWith('--')) || '.'

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

// Ordenar por nombre en base a argumento --asc o --desc, si no se especifica, por defecto como se lee de directorio
const sortOrder = process.argv.includes('--asc') ? 'asc' 
                    : process.argv.includes('--desc') ? 'desc' : null
if(sortOrder) {
    entries.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name)
        } else {
            return b.name.localeCompare(a.name)
        }
    })
}

// si se especifica --folders, solo mostrar carpetas, si se especifica --files, 
// solo mostrar archivos, si se especifican ambos, mostrar todo, 
// si no se especifica ninguno, mostrar todo
const showFolders = process.argv.includes('--folders')
const showFiles = process.argv.includes('--files')

const filteredEntries = entries.filter(entry => {
    if (showFolders && !entry.isDir) return false
    if (showFiles && entry.isDir) return false
    return true
})

// Imprimir resultados
for (const entry of filteredEntries) {
    const icon = entry.isDir ? '📁' : '📄'
    const size = entry.isDir ? '-' : ` ${entry.size}`
    console.log(`${icon} ${entry.name.padEnd(30)}${size}`)
}