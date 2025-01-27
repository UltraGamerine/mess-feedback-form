import "./forms.css"

export default async function Form({params}){
    const { id } = await params;
    return (
        <>
            <h1 className="text-3xl font-bold">
            Product: {id}
            </h1>
        </>
    )
}