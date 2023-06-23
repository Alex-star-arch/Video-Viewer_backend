function VideoFlowPage(VideoUrlList) {
    let page = `
    <div class="row m-0" style="">
    `;
    for (let i = 0; i < VideoUrlList.length; i++) {
        //判断是否为rtsp流
        const isRTSP = VideoUrlList[i].indexOf("rtsp")!==-1;
        const src=isRTSP?`ws://localhost:8888/rtsp/${i}/?url=`+VideoUrlList[i]:VideoUrlList[i];
        let InnerContent = `
      <div  class="col-4 p-0" onclick="Router(this)" data-route="VideoAnysis" data-video="${i}">
        <video autoplay muted loop style="width:100%;height: 100%;" id="Video-preview-${i}" data-protocol="${isRTSP?"RTSP":"HTTP"}" data-src="${src}">
          <source src="${VideoUrlList[i]}" type="video/mp4">
          <source src="../static/assets/video/defult.mp4" type="video/mp4">
          </video>
        </div>
      `;
        page += InnerContent;
    }
    page += "</div>";
    return page;
}

function VideoAnalysePage(VideoAnalyseList,VideoIndex) {
    const isRTSP = VideoAnalyseList.VideoUrl.indexOf("rtsp")!==-1;
    const src=isRTSP?`ws://localhost:8888/rtsp/${VideoIndex}/?url=`+VideoAnalyseList.VideoUrl:VideoAnalyseList.VideoUrl;
    let page = `
    <div class="row m-0">
      <div class="col-9 p-0" id="VideoViewer">
        <video autoplay controls style="width:100%;height: 100%;" id="Video-analyse" data-protocol="${isRTSP?"RTSP":"HTTP"}" data-src="${src}">
          <source src="${VideoAnalyseList.VideoUrl}" type="video/mp4">
           <source src="../static/assets/video/defult.mp4" type="video/mp4">
        </video>
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
    for (let VideoAnalyseImage of VideoAnalyseList.VideoAnalyseImage) {
        page += `
      <li class="list-group-item black-list">
        <div class="lightbox">
            <img src="data:image/jpeg;base64,${VideoAnalyseImage}" class="img-fluid" alt="Wild Landscape"/>
        </div>
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

function VideoManagePage(UserRole) {
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
        <div class="my-2" style="display: ${UserRole===1?"block":"none"}">
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

function UserManagePage(UserRole) {
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

function ImageManagePage(ImageList,UserRole) {
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
        <div class="lightbox">
            <img src="data:image/jpeg;base64,${ImageList[i].image}" class="img-fluid" style="max-height: 180px;width: 100%;" alt="WarnPic-${i}"/>
        </div>
        <div class="card-body p-0">
            <ul class="list-group list-group-light list-group-small">
                <li class="list-group-item px-3">图片ID:${ImageList[i].id}</li>
                <li class="list-group-item px-3">采集视频流ID:${ImageList[i].streamnum}</li>
                <li class="list-group-item px-3">采集时间：${ImageList[i].datetime}</li>
            </ul>
        </div>
      <div class="card-footer text-muted" style="display: ${UserRole===1?"block":"none"}">
        <button class="btn btn-danger" data-imageid="${ImageList[i].id}" onclick="deleteImage(this)">删除</button>
      </div>
    </div>
  `;
        page += image;
    }
    page += "</div>";
    return page;
}

function WarnManagePage() {
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
        <div id="warntable" data-mdb-stripped="true" data-mdb-max-height="80vh" data-mdb-max-width="100vw"></div>
      </div>
    </div>
  </div>
    `;
    return page;
}