const globaldata = {
  VideoUrlList: [
    "https://mdbcdn.b-cdn.net/img/new/slides/041.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/042.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/043.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/044.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/045.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/046.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/047.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/048.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/049.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/050.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/051.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/052.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/053.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/054.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/055.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/056.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/057.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/058.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/059.webp",
    "https://mdbcdn.b-cdn.net/img/new/slides/060.webp",
  ],
  VideoAnysisList: {
    VideoUrl: "http://127.0.0.1:5000/asset/big_buck_bunny.mp4",
    VideoAnysisImage: [
      "https://mdbcdn.b-cdn.net/img/new/slides/041.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/042.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/043.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/044.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/045.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/046.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/047.webp",
      "https://mdbcdn.b-cdn.net/img/new/slides/048.webp",
    ],
  },
  StreamList: [
    {
      datetime: "Thu, 23 Mar 2023 23:02:31 GMT",
      id: 1,
      stream: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
      streamname: "第三区",
    },
  ],
  User: {
    username: "",
    email: "",
    phone: "",
  },
  UserList: [],
  UserColumn: [
    { label: "用户名", field: "username" },
    { label: "ID", field: "id" },
    { label: "角色", field: "role" },
    { label: "操作", field: "operation", sort: false },
  ],
};

let videotable = null;
let usertable = null;
const addmodal = new mdb.Modal(document.getElementById("addmodal"));
const updatemodal = new mdb.Modal(document.getElementById("updatemodal"));
const timemodal = new mdb.Modal(document.getElementById("timemodal"));
const pickerInline = document.querySelector(".timepicker-inline-24");
const timepickerMaxMin = new mdb.Timepicker(pickerInline, {
  format24: true,
  inline: true,
});

function init() {
  const sidenav = document.getElementById("Side-nav");
  const sidenavInstance = mdb.Sidenav.getInstance(sidenav);
  sidenavInstance.show();
  getVideoList();
  getStreamList();
  getUser();
  getUserList();
}

init();
Router = async function (Data) {
  let Link = Data.getAttribute("data-route");
  let VideoId = Data.getAttribute("data-video");
  console.log(Link, VideoId);
  console.log(Data);
  switch (Link) {
    case "VideoFlow":
      loadPage(VideoFlowPage(globaldata.VideoUrlList));
      break;
    case "VideoAnysis":
      if (!VideoId) getVideoImage(0);
      else await getVideoImage(VideoId);
      globaldata.VideoAnysisList.VideoUrl = globaldata.VideoUrlList[VideoId];
      loadPage(VideoAnysisPage(globaldata.VideoAnysisList));
      break;
    case "VideoManage":
      loadPage(VideoManagePage());
      videotable = VideoManageInit();
      break;
    case "UserManage":
      loadPage(UserManagePage());
      usertable = UserManageInit();
      break;
    case "UserPannel":
      loadPage(UserPannelPage(globaldata.User));
      break;
    default:
      break;
  }
};

function loadPage(page) {
  document.querySelector("#Content").innerHTML = page;
}

function VideoFlowPage(VideoUrlList) {
  let page = `
  <div class="row m-0" style="">
  `;
  for (let i = 0; i < VideoUrlList.length; i++) {
    let InnerContent = `
    <div  class="col-3 p-0" onclick="Router(this)" data-route="VideoAnysis" data-video="${i}">
      <video autoplay style="width:100%;height: 100%;">
        <source src="${VideoUrlList[i]}" type="video/mp4">
        </video>
        <!-- <img src="${VideoUrlList[i]}" class="img-fluid" alt="Wild Landscape" /> -->
      </div>
    `;
    page += InnerContent;
  }
  page += "</div>";
  return page;
}

function VideoAnysisPage(VideoAnysisList) {
  let page = `
  <div class="row m-0">
    <div class="col-9 p-0" id="VideoViewer">
      <video autoplay controls style="width:100%;height: 100%;">
        <source src="${VideoAnysisList.VideoUrl}" type="video/mp4">
      </video>
      <!-- <img src="${VideoAnysisList.VideoUrl}" class="img-fluid" alt="Wild Landscape" /> -->
      <div class="p-4 d-flex" id="BottomBar">
        <div class="btn-outline-light p-3 mx-3 bg-gradient d-flex flex-column align-items-center OperatorButton" data-mdb-toggle="modal" data-mdb-target="#timemodal">
          <i class="far fa-clock fa-4x mx-4"></i>
          <span class="d-block fs-4">定时</span>
        </div>
      </div>
    </div>
    <div class="col-3 p-0" id="ImageList">
      <ul class="list-group list-group-light" id="ImageList">
  `;
  for (let VideoAnysisImage of VideoAnysisList.VideoAnysisImage) {
    page += `
    <li class="list-group-item">
      <img src="data:image/jpeg;base64,${VideoAnysisImage}" class="img-fluid" alt="Wild Landscape"/>
    </li>
    `;
  }
  page += `
      </ul>
    </div>
  </div>
  `;
  return page;
}

function VideoManagePage() {
  let page = `
  <div class="row m-0 vh-100">
  <div class="card ">
    <div class="card-header">
      <div class="form-outline my-3">
        <input
          type="text"
          class="form-control"
          id="datatable-search-input"
        />
        <label class="form-label" for="datatable-search-input"
          >Search</label
        >
      </div>
    </div>
    <div class="card-body">
      <div class="my-2">
        <button type="button" class="btn btn-primary" id="add-btn">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div id="datatable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
    </div>
  </div>
</div>
  `;
  return page;
}

function VideoManageInit() {
  // Datatable 初始化
  // 按钮事件
  const customDatatable = document.getElementById("datatable");
  const setActions = () => {
    document.getElementsByClassName("update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`update ${id}`);
        document.getElementById("upstreamid").value = id;
        (document.getElementById("upstreamname").value =
          globaldata.StreamList[id - 1].streamname),
          (document.getElementById("upstreamurl").value =
            globaldata.StreamList[id - 1].stream),
          updatemodal.show();
      });
    });
    document.getElementsByClassName("delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`delete ${id}`);
        deleteStream(id);
      });
    });
  };

  document.querySelector("#add-btn").addEventListener("click", () => {
    console.log("add");
    document.getElementById("streamid").value = "无需填写";
    addmodal.show();
  });

  customDatatable.addEventListener("render.mdb.datatable", setActions);

  const options = {
    striped: true,
    selectable: false,
    loaderClass: "bg-info",
    borderColor: "light",
    bordered: true,
    multi: true,
    entriesOptions: [5, 10, 15],
    fixedHeader: true,
    loading: true,
  };

  const basicData = CalcVideoData();
  const TableInstance = new mdb.Datatable(
    document.getElementById("datatable"),
    basicData,
    options
  );
  // 搜索框
  document
    .getElementById("datatable-search-input")
    .addEventListener("input", (e) => {
      TableInstance.search(e.target.value);
    });
  TableInstance.update(basicData, { loading: false });
  return TableInstance;
}
function CalcVideoData() {
  let VideoData = {
    columns: [
      { label: "ID", field: "id" },
      { label: "Name", field: "streamname" },
      { label: "Date Time", field: "datetime" },
      { label: "Stream", field: "stream" },
      { label: "操作", field: "operation", sort: false },
    ],
    rows: [...globaldata.StreamList].map((row) => {
      return {
        ...row,
        operation: `
    <button class="update-btn btn btn-outline-primary btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fas fa-edit"></i></button>
    <button class="delete-btn btn ms-2 btn-danger btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fa fa-trash"></i></button>`,
      };
    }),
  };
  return VideoData;
}

function UserManagePage() {
  let page = `
  <div class="row m-0 vh-100">
  <div class="card ">
    <div class="card-header">
      <div class="form-outline my-3">
        <input
          type="text"
          class="form-control"
          id="datatable-search-input"
        />
        <label class="form-label" for="datatable-search-input"
          >Search</label
        >
      </div>
    </div>
    <div class="card-body">
      <div class="my-2">
        <button type="button" class="btn btn-primary" id="add-btn">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div id="usertable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
    </div>
  </div>
</div>
  `;
  return page;
}

function UserManageInit() {
  // Datatable 初始化
  // 按钮事件
  const customDatatable = document.getElementById("usertable");
  const setActions = () => {
    document.getElementsByClassName("update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`update ${id}`);
        document.getElementById("upstreamid").value = id;
        (document.getElementById("upstreamname").value =
          globaldata.StreamList[id - 1].streamname),
          (document.getElementById("upstreamurl").value =
            globaldata.StreamList[id - 1].stream),
          updatemodal.show();
      });
    });
    document.getElementsByClassName("delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`delete ${id}`);
        deleteStream(id);
      });
    });
  };

  document.querySelector("#add-btn").addEventListener("click", () => {
    console.log("add");
    document.getElementById("streamid").value = "无需填写";
    addmodal.show();
  });

  customDatatable.addEventListener("render.mdb.datatable", setActions);

  const options = {
    striped: true,
    selectable: false,
    loaderClass: "bg-info",
    borderColor: "light",
    bordered: true,
    multi: true,
    entriesOptions: [5, 10, 15],
    fixedHeader: true,
    loading: true,
  };

  const basicData = CalcUserData();
  const TableInstance = new mdb.Datatable(
    document.getElementById("usertable"),
    basicData,
    options
  );
  // 搜索框
  document
    .getElementById("datatable-search-input")
    .addEventListener("input", (e) => {
      TableInstance.search(e.target.value);
    });
  TableInstance.update(basicData, { loading: false });
  return TableInstance;
}
function CalcUserData() {
  let UserData = {
    columns: [
      { label: "用户名", field: "username" },
      { label: "ID", field: "id" },
      { label: "角色", field: "role" },
      { label: "操作", field: "operation", sort: false },
    ],
    rows: [...globaldata.UserList].map((row) => {
      return {
        ...row,
        operation: `
    <button class="update-btn btn btn-outline-primary btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fas fa-edit"></i></button>
    <button class="delete-btn btn ms-2 btn-danger btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fa fa-trash"></i></button>`,
      };
    }),
  };
  return UserData;
}
function UserPannelPage(User) {
  let page = `
  <div class="row d-flex justify-content-center align-items-center vh-100 bg-light">
  <div class="card text-center  shadow-0 p-0 w-25 shadow-custom">
    <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
      <img src="https://mdbootstrap.com/img/new/standard/nature/111.webp" class="img-fluid" />
      <a href="#!">
        <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
      </a>
    </div>
    <div class="card-header">${User.name}</div>
    <div class="card-body">
      <h5 class="card-title">${User.phone}</h5>
      <p class="card-text">
        ${User.email}
      </p>
      <button type="button" class="btn btn-primary" onclick="tologin()">注销</button>
    </div>
  </div>
</div>
  `;
  return page;
}

function tologin() {
  window.location.href = "http://127.0.0.1:5000/login?next=%2F";
}
function getVideoList() {
  // 从后端获取视频列表（axiox)
  axios.get("/allvideolist").then((res) => {
    console.log(res);
    globaldata.VideoUrlList = res.data;
  });
}

async function getVideoImage(id) {
  //videoid=id;
  id = parseInt(id) + 1;
  await axios.get("/videoimage?videoid=" + id).then((res) => {
    console.log(res);
    globaldata.VideoAnysisList.VideoAnysisImage = [...res.data];
  });
}

function getStreamList() {
  // 从后端获取摄像头列表（axiox)
  axios.get("/videolistquery").then((res) => {
    console.log(res);
    globaldata.StreamList = res.data;
    videotable.update(CalcVideoData());
  });
}

function updateStream() {
  axios
    .post("/videolistupdate", {
      videoid: document.getElementById("upstreamid").value,
      streamname: document.getElementById("upstreamname").value,
      stream: document.getElementById("upstreamurl").value,
    })
    .then((res) => {
      console.log(res);
      if (res.data == "Success") {
        alert("修改成功");
        updatemodal.hide();
        getStreamList();
      } else {
        alert("修改失败");
      }
    });
}

function addStream() {
  axios
    .post("/videolistadd", {
      streamname: document.getElementById("streamname").value,
      stream: document.getElementById("streamurl").value,
    })
    .then((res) => {
      console.log(res);
      if (res.data == "Success") {
        alert("添加成功");
        addmodal.hide();
        getStreamList();
      } else {
        alert("添加失败");
      }
    });
}

function deleteStream(id) {
  axios
    .post("/videolistdelete", {
      videoid: id,
    })
    .then((res) => {
      console.log(res);
      if (res.data == "Success") {
        alert("删除成功");
        getStreamList();
      } else {
        alert("删除失败");
      }
    });
}
function getUserList() {
  // 从后端获取用户列表（axiox)
  axios.get("/userlistquery").then((res) => {
    console.log(res);
    globaldata.UserList = res.data;
  });
}
function addClock() {
  const valueDiv = document.querySelector("#timeform").value;
  //  valueDiv.innerText = input.target.value;
  let time = valueDiv.split(":");
  let hour = time[0];
  let minute = time[1];
  let form = new FormData();
  form.append("hour", hour);
  form.append("minute", minute);
  axios.post("/addClock", form).then((res) => {
    console.log(res);
    if (res.data == "success") {
      alert("设置成功");
    }
  });
}

function getUser() {
  axios.get("/admin").then((res) => {
    console.log(res);
    globaldata.User = res.data[0];
  });
}
