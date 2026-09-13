export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio?: string;
  enlace?: string;
  enlaceTexto?: string;
  icono?: string;
}

export interface Testimonio {
  id: number;
  nombre: string;
  texto: string;
  destacado?: boolean;
}

export interface Colaborador {
  id: string;
  nombre: string;
  logo: string;
  enlace: string;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol?: string;
  descripcion: string[];
  imagen: string;
  enlace: string;
}

export interface Motivo {
  id: string;
  titulo: string;
  texto: string;
}
