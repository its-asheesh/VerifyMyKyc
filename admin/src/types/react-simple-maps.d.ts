declare module 'react-simple-maps' {
  import { ReactNode } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: any
    width?: number
    height?: number
    children?: ReactNode
    onMouseMove?: (event: any) => void
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: any[] }) => ReactNode
  }

  export interface GeographyProps {
    geography: any
    fill?: string
    stroke?: string
    strokeWidth?: number
    opacity?: number
    style?: any
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onClick?: () => void
  }

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    center?: [number, number]
    onMoveEnd?: (position: any) => void
    maxZoom?: number
    minZoom?: number
    children?: ReactNode
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
  export const Marker: React.FC<MarkerProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
} 