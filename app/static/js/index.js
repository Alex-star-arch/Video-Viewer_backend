const globaldata = {
  VideoUrlList: [],
  VideoAnysisList: {
    VideoUrl: "",
    VideoAnysisImage: [],
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
    id: "",
    role: "",
  },
  UserList: [
    {
      username: "admin",
      id: "1",
      role: "1",
    },
  ],
  UserColumn: [
    { label: "用户名", field: "username" },
    { label: "ID", field: "id" },
    { label: "角色", field: "role" },
    { label: "操作", field: "operation", sort: false },
  ],
  StreamColumn: [
    { label: "视频名称", field: "name" },
    { label: "视频ID", field: "id" },
    { label: "视频地址", field: "url" },
    { label: "操作", field: "operation", sort: false },
  ],
};

let videotable = null;
let usertable = null;

const addmodal = new mdb.Modal(document.getElementById("addmodal"));
const updatemodal = new mdb.Modal(document.getElementById("updatemodal"));
const timemodal = new mdb.Modal(document.getElementById("timemodal"));
const usermodal = new mdb.Modal(document.getElementById("usermodal"));
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

function VideoManageInit() {
  const streamDatatable = document.getElementById("datatable");
  const setActions = () => {
    // 视频流更新按钮
    document.getElementsByClassName("update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`update Stream ${id}`);
        document.getElementById("upstreamid").value =
          globaldata.StreamList.find((item) => item.id == id).id;
        document.getElementById("upstreamname").value =
          globaldata.StreamList.find((item) => item.id == id).streamname;
        document.getElementById("upstreamurl").value =
          globaldata.StreamList.find((item) => item.id == id).stream;
        updatemodal.show();
      });
    });
    // 视频流删除按钮
    document.getElementsByClassName("delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`delete Stream ${id}`);
        deleteStream(id);
      });
    });
  };

  document.querySelector("#add-btn").addEventListener("click", () => {
    console.log("add");
    document.getElementById("streamid").value = "无需填写";
    addmodal.show();
  });

  streamDatatable.addEventListener("render.mdb.datatable", setActions);

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
// 计算视频流数据
function CalcVideoData() {
  let VideoData = {
    columns: [...globaldata.StreamColumn],
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
//初始化用户表格
function UserManageInit() {
  const userDatatable = document.getElementById("usertable");
  const setActions = () => {
    // 用户更新按钮
    document.getElementsByClassName("update-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.attributes["data-mdb-id"].value;
        console.log(`update User ${id}`);
        document.getElementById("upuserid").value = globaldata.UserList.find(
          (item) => {
            return item.id == id;
          }
        ).id;
        document.getElementById("upusername").value = globaldata.UserList.find(
          (item) => {
            return item.id == id;
          }
        ).username;
        document.getElementById("upuserrole").value = globaldata.UserList.find(
          (item) => {
            return item.id == id;
          }
        ).role;
        usermodal.show();
      });
    });
  };

  document.querySelector("#add-btn").addEventListener("click", () => {
    console.log("add");
    document.getElementById("streamid").value = "无需填写";
    addmodal.show();
  });

  userDatatable.addEventListener("render.mdb.datatable", setActions);

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
  TableInstance.update(basicData);
  return TableInstance;
}
// 计算用户数据
function CalcUserData() {
  let UserData = {
    columns: [...globaldata.UserColumn],
    rows: [...globaldata.UserList].map((row) => {
      return {
        ...row,
        operation: `
    <button class="update-btn btn btn-outline-primary btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fas fa-edit"></i></button>`,
      };
    }),
  };
  return UserData;
}

function getVideoList() {
  // 从后端获取视频列表（axios)
  axios.get("/allvideolist").then((res) => {
    console.log(res);
    globaldata.VideoUrlList = res.data;
  });
}

function getVideoImage(id) {
  // 从后端获取视频分析图像（axios)
  id = parseInt(id) + 1;
  axios.get("/videoimage?videoid=" + id).then((res) => {
    console.log(res);
    globaldata.VideoAnysisList.VideoAnysisImage = [...res.data];
  });
}

function getStreamList() {
  // 从后端获取视频流列表（axios)
  axios.get("/videolistquery").then((res) => {
    console.log(res);
    globaldata.StreamList = res.data;
    videotable.update(CalcVideoData());
  });
}

function updateStream() {
  // 更新视频流（axios)
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
  // 添加视频流（axios)
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
  // 删除视频流（axios)
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
  // 从后端获取用户列表（axios)
  axios.get("/userlistquery").then((res) => {
    console.log(res);
    globaldata.UserList = res.data;
    usertable.update(CalcUserData());
  });
}

function updateUser() {
  // 更新用户信息（axios)
  axios
    .post("/userlistupdate", {
      userid: document.getElementById("upuserid").value,
      username: document.getElementById("upusername").value,
      role: document.getElementById("upuserrole").value,
    })
    .then((res) => {
      console.log(res);
      if (res.data == "Success") {
        alert("修改成功");
        usermodal.hide();
        getUserList();
      } else {
        alert("修改失败");
      }
    });
}

function getUser() {
  // 从后端获取用户信息（axios)
  axios.get("/admin").then((res) => {
    console.log(res);
    globaldata.User = res.data[0];
  });
}

function addClock() {
  // 添加定时（axios)
  const valueDiv = document.querySelector("#timeform").value;
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

function tologin() {
  window.location.href = "http://127.0.0.1:5000/login?next=%2F";
}
