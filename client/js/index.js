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
        // if(imageName.files[0]){
            let response = await fetch('/api', {
                method: 'POST',
                body: new FormData(form)
            })

            let result = await response.text()
            if(response.status === 301) {
                window.location.href=result
            } else {
                fileName.classList.remove('hide')
                fileName.textContent = result
            }
        // } else {
            fileName.textContent = "Please, Choose a file"
        // }
    }

    btn.addEventListener('click',uploadImage)
}