const addBox = document.querySelector(".add-box")
const checkbox_item = document.querySelectorAll(".checkbox_item")
const noidungs = document.querySelectorAll(".noidung")
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7",
              "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const notes =  JSON.parse(localStorage.getItem("notes") || "[]" )
let isUpdate = false, updateId;
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Thêm mới công việc";
    addBtn.innerText = "Thêm";
    popupBox.classList.add("show");
    
     titleTag.focus();
});


closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    
});
window.addEventListener("click",function(e){
    if(e.target === popupBox){
        titleTag.value = descTag.value = "";
        popupBox.classList.remove("show")
    }
})
function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let iscompleted = note.status == "completed" ? "checked" : ""
        let liTag = `<li class="note">
                        <div class="details">
                            <div class="flex_checkbok">
                            <div class="noidung ${iscompleted}">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                            </div>
                            <input onclick="checkbox_item_true(this)" type="checkbox" id="${id}" ${iscompleted} />
                            </div>
                            
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                
                                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis-vertical"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
function checkbox_item_true(c_item){
    let taskname = c_item.parentElement.firstElementChild;
    
    
    if(c_item.checked){
        let checkbox_modal = confirm("Có chắc hoàn thành công việc không");
        if(!checkbox_modal) return;
        taskname.classList.add("checked")
        notes[c_item.id].status = "completed"
    } else{
        taskname.classList.remove("checked")
        notes[c_item.id].status = "pending"
    }
    localStorage.setItem("notes",JSON.stringify(notes))
}

showNotes();
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}


// checkbox_item.forEach(item_box => item_box.addEventListener("change",function(){
//     if(item_box.checked){
//                 noidungs.classList.add("gn_item")
//             } else{
//                 noidungs.classList.remove("gn_item")
//             }
// }))
// checkbox_item.forEach(item_box => )
// checkbox_item.addEventListener("change",function(){
//     if(checkbox_item.checked){
//         checkbox_item.classList.add("gn_item")
//     } else{
//         checkbox_item.classList.remove("gn_item")
//     }
// })


function deleteNote(noteId) {
    let confirmDel = confirm("Bạn có muốn xóa công việc không ?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Cập nhập công việc";
    addBtn.innerText = "Cập nhập";
}
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();
    if(title || description) {
        let currentDate = new Date(),
        time = currentDate.getHours(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
        let noteInfo = {title, description, date: `${time} giờ  ${day}/${month}/${year}`,status: "pending"}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});