window.onload = ()=>{
    const btn = document.getElementById('btn')
    let form = document.getElementById('form')
    let imageName = document.getElementById('imgName')
    let fileName = document.getElementById('fileName')
    imageName.addEventListener('change',getFileName)

    function getFileName(e){
        let name = e.target.files[0].name
        fileName.textContent = name
        fileName.classList.remove('hide')
    }

    async function uploadImage(e){
        e.preventDefault();

        let response = await fetch('/api', {
            method: 'POST',
            body: new FormData(form)
        })

        let result = await response.text()
        window.location.href=result
    }


    btn.addEventListener('click',uploadImage)
}