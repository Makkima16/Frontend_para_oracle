export class Partido {
    id?: number
    equipo1: number
    equipo2: number
    fecha: string
    fin: string

    estadio: string
    estado: string
    goles_equipo1?:number
    goles_equipo2?:number

    resultado_partido?:string

    nombre_1?: string; // Aquí estará el nombre del equipo 1
    nombre_2?: string; // Aquí estará el nombre del equipo 2
}
