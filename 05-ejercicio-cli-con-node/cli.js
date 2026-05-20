import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Aquí irá el código

// Directorio a listar , lee parametros desde la línea de comandos y remueve los que tengan -- o -
const dir = process.argv.slice(2).find(arg => !arg.startsWith('--')) || '.'

// Revisa si se tiene acceso de lectura al directorio en el directorio 
// Si no tiene acceso, muestra un error y termina el programa
// Debemos agregar nullish coalescing para evitar errores si process.permission no existe.
// Si ejecutamos el comando sin el flag --permission, process.permission no existe
if (!process.permission?.has('fs.read', dir)) {
    console.error('No se tiene permiso de lectura para el directorio especificado.')
    // Esto es opcional, pero siempre está bueno darle al usuario una pista de cómo solucionarlo
    console.error(`Para acceder a este directorio, ejecuta el comando con el flag --allow-fs-read=${dir}`)
    console.error(`Ejemplo: node --permission --allow-fs-read=${dir} cli.js ${dir}`)
    process.exit(1)
}

// Formatear el tamaño de los archivos
const formatSize = (size) => {
    if (size < 1024) return `${size} B`
    return `${(size / 1024).toFixed(2)} KB`
}

// Leer nombre de archivos
let files
// Si el directorio al que accedemos no existe, se rompe el programa
// Si lo envolvemos en un try/catch, podemos manejar el error y mostrar un mensaje más amigable
try {
    files = await readdir(dir)
} catch (error) {
    console.error('Error al leer el directorio: ', dir)
    console.error(`Verifica si existe.`)
    process.exit(1)
}

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