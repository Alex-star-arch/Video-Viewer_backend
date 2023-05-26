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
      <li class="list-group-item black-list">
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
        <div id="usertable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
      </div>
    </div>
  </div>
    `;
    return page;
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

function ImageManagePage(ImageList) {
    //将ImageList中的datetime(Thu, 23 Mar 2023 20:03:42 GMT)转换为2023-05-23 20:03:42
    for (let i = 0; i < ImageList.length; i++) {
        ImageList[i].datetime = Date.parse(ImageList[i].datetime);
        ImageList[i].datetime = new Date(ImageList[i].datetime).toLocaleDateString();
    }
    let page = `
    <div class="container d-flex vh-100 p-3 flex-wrap">
    `;
    for (let i = 0; i < ImageList.length; i++) {
        let image = `
    <div class="card col-3 p-0 mx-2 my-2" style="height: fit-content;">
      <img src="data:image/jpeg;base64,${ImageList[i].image}" class="img-fluid" style="max-height: 180px"/>
        <div class="card-body p-0">
            <ul class="list-group list-group-light list-group-small">
                <li class="list-group-item px-3">图片ID:${ImageList[i].id}</li>
                <li class="list-group-item px-3">采集视频流ID:${ImageList[i].streamnum}</li>
                <li class="list-group-item px-3">采集时间：${ImageList[i].datetime}</li>
            </ul>
        </div>
      <div class="card-footer text-muted">
        <button class="btn btn-danger" data-imageid="${ImageList[i].id}" onclick="deleteImage(this)">删除</button>
      </div>
    </div>
  `;
        page += image;
    }
    page += "</div>";
    return page;
}

function WarningManagePage() {
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
        <div id="waringtable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
      </div>
    </div>
  </div>
    `;
    return page;
}