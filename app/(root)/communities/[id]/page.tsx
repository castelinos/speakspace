async function Page({params}: {params:{ id: string}}){
    return(
        <section>
            Community pages - {params.id}
        </section>
    )
}