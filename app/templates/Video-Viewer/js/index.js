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
    VideoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
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
  CameraList:[
    {
      "datetime": "Thu, 23 Mar 2023 23:02:31 GMT",
      "id": 1,
      "stream": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
      "streamname": "第三区"
  },
  ]
};

function init() {
  const sidenav = document.getElementById("Side-nav");
  const sidenavInstance = mdb.Sidenav.getInstance(sidenav);
  sidenavInstance.show();
  // getVideoList();
  // getStreamList();
}

init();
ClickRouter=function(Data) {
  switch (Data.getAttribute("data-route")) {
    case "VideoFlow":
      document.querySelector("#VideoFlow").click();
      break;
    case "VideoAnysis":
      document.querySelector("#VideoAnysis").click();
      break;
    case "VideoManage":
      document.querySelector("#VideoManage").click();
      break;
    case "UserManage":
      document.querySelector("#UserManage").click();
      break;
    default:
      break;
}
}
Router = function (Data) {
  // Data.setArrtibute("active","");
  let Link = Data.getAttribute("data-route");
  let VideoId=Data.getAttribute("data-video");
  console.log(Link,VideoId);
  switch (Link) {
    case "VideoFlow":
      loadPage(VideoFlowPage(globaldata.VideoUrlList));
      break;
    case "VideoAnysis":
      if(!VideoId)getVideoImage(0);
      else getVideoImage(VideoId);
      loadPage(VideoAnysisPage(globaldata.VideoAnysisList));
      break;
    case "VideoManage":
      loadPage(VideoManagePage());
      VideoManageInit();
      break;
    case "UserManage":
      loadPage(UserManagePage());
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
  for (let i=0;i<VideoUrlList.length;i++) {
    let InnerContent = `
    <div  class="col-3 p-0" onclick="Router(this)" data-route="VideoAnysis" data-video="0">
        <img src="${VideoUrlList[i]}" class="img-fluid" alt="Wild Landscape" />
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

        <div class="btn-outline-light p-3 mx-3 bg-gradient d-flex flex-column align-items-center OperatorButton">
          <i class="fas fa-cut fa-4x mx-4"></i>
          <span class="d-block fs-4">截图</span>
        </div>
        <div class="btn-outline-light p-3 mx-3 bg-gradient d-flex flex-column align-items-center OperatorButton">
          <i class="fas fa-cut fa-4x mx-4"></i>
          <span class="d-block fs-4">截图</span>
        </div>

      </div>
    </div>
    <div class="col-3 p-0" id="ImageList">
      <ul class="list-group list-group-light" id="ImageList">
  `;
  for (let VideoAnysisImage of VideoAnysisList.VideoAnysisImage) {
    page += `
    <li class="list-group-item">
      <img src="${VideoAnysisImage}" class="img-fluid" alt="Wild Landscape"/>
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
      <div id="datatable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
    </div>
  </div>
</div>
  `;
  return page;
}

function VideoManageInit() {
  // Datatable
  const customDatatable = document.getElementById("datatable");
  const setActions = () => {
    document.getElementsByClassName("update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(`update ${btn.attributes["data-mdb-id"].value}`);
      });
    });
    document.getElementsByClassName("delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(`delete ${btn.attributes["data-mdb-id"].value}`);
      });
    });
  };
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
  };
  const basicData = {
    columns: [
      { label: "ID", field: "id" },
      { label: "Name", field: "streamname" },
      { label: "Date Time", field: "datetime" },
      { label: "Stream", field: "stream" },
      { label: "Operation", field: "operation", sort: false },
    ],
    rows: [...globaldata.CameraList].map((row) => {
      return {
        ...row,
        operation: `
    <button class="update-btn btn btn-outline-primary btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fas fa-edit"></i></button>
    <button class="delete-btn btn ms-2 btn-danger btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fa fa-trash"></i></button>`,
      };
    }),
  };
  const searchInstance = new mdb.Datatable(
    document.getElementById("datatable"),
    basicData,
    options
  );
  document
    .getElementById("datatable-search-input")
    .addEventListener("input", (e) => {
      searchInstance.search(e.target.value);
    });
}

function UserManagePage() {
  let page = `
  <div class="row d-flex justify-content-center align-items-center vh-100 bg-light">
  <div class="card text-center  shadow-0 p-0 w-25 shadow-custom">
    <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
      <img src="https://mdbootstrap.com/img/new/standard/nature/111.webp" class="img-fluid" />
      <a href="#!">
        <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
      </a>
    </div>
    <div class="card-header">管理员</div>
    <div class="card-body">
      <h5 class="card-title">用户名</h5>
      <p class="card-text">
        用户描述
      </p>
      <button type="button" class="btn btn-primary">注销</button>
    </div>
  </div>
</div>
  `;
  return page;
}

function getVideoList() {
  // 从后端获取视频列表（axiox)
  axios.get("/api/allvideolist").then((res) => {
    console.log(res);
    globaldata.VideoUrlList = res.data;
  }
  );
}

async function getVideoImage(id){
  //videoid=id;
  await axios.get("/videoimage?videoid="+id).then((res) => {
    console.log(res);
    globaldata.VideoAnysisList.VideoAnysisImage = res.data;
  }
  );
}

function getStreamList() {
  // 从后端获取摄像头列表（axiox)
  axios.get("/videolistquery").then((res) => {
    console.log(res);
    globaldata.CameraUrlList = res.data;
  }
  );
}

function updateStream(id){
  axios.post("/updatestream",{
    id:id,
    streamname:document.getElementById("streamname").value,
    streamurl:document.getElementById("streamurl").value,
    streamdesc:document.getElementById("streamdesc").value,
  }).then((res) => {
    console.log(res);
    if(res.data.status==1){
      alert("修改成功");
    }
  }
  );
}

function addStream(){
  axios.post("/addstream",{
    streamname:document.getElementById("streamname").value,
    streamurl:document.getElementById("streamurl").value,
    streamdesc:document.getElementById("streamdesc").value,
  }).then((res) => {
    console.log(res);
    if(res.data.status==1){
      alert("添加成功");
    }
  }
  );
}

function deleteStream(id){
  axios.post("/deletestream",{
    id:id,
  }).then((res) => {
    console.log(res);
    if(res.data.status==1){
      alert("删除成功");
    }
  }
  );
}