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