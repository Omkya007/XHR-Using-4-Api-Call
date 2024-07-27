const cl = console.log;

const postForm = document.getElementById("postForm");
const titleCon = document.getElementById("title");
const contentCon = document.getElementById("content");
const userIdCon = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const cardCon = document.getElementById("cardCon");
const loader = document.getElementById("loader");

const BASE_URL = "https://jsonplaceholder.typicode.com";

const POST_URL = `${BASE_URL}/posts`;

const templating = (arr) => {
  let res = ``;

  arr.forEach((ele) => {
    res += `
            <div class="col-md-4 mb-4">
            <div class="card text-white postCard h-100" id="${ele.id}">
                <div class="card-header">
                    <h3 class="m-0">${ele.title}</h3>
                </div>
                <div class="card-body">
                    <p class="m-0">${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-primary btn-sm" onclick="onEdit(this)" id="but">Edit</button>
                    <button type="button" class="btn btn-warning btn-sm" onclick ="onRemove(this)" id="but">Delete</button>
                </div>
            </div>
        </div>
    
    
    
    `;
  });
  cardCon.innerHTML = res;
};

const fetchBlog = () => {
  setTimeout(() => {
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open("GET", POST_URL);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        cl(xhr.response);

        let data = JSON.parse(xhr.response);
        templating(data);
      }
      loader.classList.add('d-none');
    };

    xhr.send();
    
  }, 500);
};

fetchBlog();

//create
const onPost = (eve) => {
  eve.preventDefault();
  cl("submitted");

  let newObj = {
    title:titleCon.value,
    body:contentCon.value,
    userId:userIdCon.value
  };
  cl(newObj)
  loader.classList.remove('d-none');
  let xhr =new XMLHttpRequest();

  xhr.open("POST",POST_URL);
  xhr.onload = function(){
    if(xhr.status>=200 && xhr.status<300){
      cl(xhr.response)

      newObj.id= JSON.parse(xhr.response).id;

      let div = document.createElement('div');
      div.className="col-md-4 mb-4";
      div.innerHTML = `

      <div class="card text-white postCard h-100" id="${newObj.id}">
                <div class="card-header">
                    <h3 class="m-0">${newObj.title}</h3>
                </div>
                <div class="card-body">
                    <p class="m-0">${newObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-primary btn-sm" onclick="onEdit(this)" id="but">Edit</button>
                    <button type="button" class="btn btn-warning btn-sm" onclick="onRemove(this)" id="but">Delete</button>
                </div>
            </div>
      `
      cardCon.prepend(div);
    }
    loader.classList.add('d-none');

  }

  xhr.send(JSON.stringify(newObj))
};


//edit

const onEdit = (ele)=>{
  let editId = ele.closest(`.card`).id;
  cl(editId);

  localStorage.setItem("editId",editId);

  let EDIT_URL = `${BASE_URL}/posts/${editId}`;
  loader.classList.remove('d-none');
  let xhr =new XMLHttpRequest();

  xhr.open("GET",EDIT_URL);
  xhr.onload = function(){
    if(xhr.status>=200 && xhr.status<300){
      cl(xhr.response);

      let post= JSON.parse(xhr.response);
      titleCon.value = post.title,
      contentCon.value = post.body,
      userIdCon.value = post.userId
      submitBtn.classList.add('d-none');
      updateBtn.classList.remove('d-none');
    }
  }
  loader.classList.add('d-none');

  xhr.send()

}

//update
const onUpdate =()=>{
  let updatedObj = {
    title:titleCon.value,
    body:contentCon.value,
    userId:userIdCon.value
  }
  cl(updatedObj)
  postForm.reset();
  let updateId = localStorage.getItem("editId");
  cl(updateId);

  let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

  
  loader.classList.remove('d-none');
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH",UPDATE_URL);

  xhr.onload = function(){
    if(xhr.status>=200 && xhr.status<300){
      cl(xhr.status)

      let card = [...document.getElementById(updateId).children];

      card[0].innerHTML = `<h3 class="m-0">${updatedObj.title}</h3>`;
      card[1].innerHTML = ` <p class="m-0">${updatedObj.body}</p>`
      submitBtn.classList.remove('d-none');
      updateBtn.classList.add('d-none');
    }
    loader.classList.add('d-none');
  }

  xhr.send(JSON.stringify(updatedObj))

}

//delete

const onRemove = (ele)=>{
  let removeId = ele.closest(`.card`);
  cl(removeId);

  

  let REMOVE_URL = `${BASE_URL}/posts/${removeId}`;
  loader.classList.remove('d-none');
  let xhr = new XMLHttpRequest();

  xhr.open("DELETE",REMOVE_URL);
  xhr.onload = function(){
    if(xhr.status>=200 && xhr.status<300){
      
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          ele.closest(`.card`).parentElement.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your card has been deleted.",
            icon: "success"
          });
        }
      });
      
    }
    loader.classList.add('d-none');
  }

  xhr.send()

}



updateBtn.addEventListener("click",onUpdate)
postForm.addEventListener("submit", onPost);
