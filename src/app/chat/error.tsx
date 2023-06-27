"use client"

export default function Error(props: any) {
    return (
        <p>Ops, aconteceu um erro: {JSON.stringify(props)}</p>
    )
}