const globaldata = {
    VideoUrlList: [],
    VideoAnalyseList: {
        VideoUrl: "",
        VideoAnalyseImage: [],
    },
    StreamList: [],
    UserList: [],
    ImageList: [],
    Token: localStorage.getItem('token'),
    User: {
        username: "",
        id: "",
        role: "",
    },
    WarnList: [],
    UserColumn: [
        {label: "ID", field: "id"},
        {label: "用户名", field: "username"},
        {label: "角色", field: "role"},
        {label: "操作", field: "operation", sort: false},
    ],
    StreamColumn: [
        {label: "视频ID", field: "id",},
        {label: "视频名称", field: "streamname"},
        {label: "视频地址", field: "stream"},
        {label: "修改日期", field: "datetime"},
        {label: "操作", field: "operation", sort: false},
    ],
    WarningColumn: [
        {label: "警告视频流ID", field: "streamid"},
        {label: "警告视频流名称", field: "streamname"},
        {label: "警告时间", field: "datetime"},
        {label: "警告内容", field: "warncontent"},
    ],
};

let videoTable = null;
let userTable = null;
let warnTable = null;

const addModal = new mdb.Modal(document.getElementById("addmodal"));
const updateModal = new mdb.Modal(document.getElementById("updatemodal"));
const timeModal = new mdb.Modal(document.getElementById("timemodal"));
const userModal = new mdb.Modal(document.getElementById("usermodal"));
const pickerInline = document.querySelector(".timepicker-inline-24");
const timepickerMaxMin = new mdb.Timepicker(pickerInline, {
    format24: true,
    inline: true,
});
const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
const collapseList = collapseElementList.map((collapseEl) => {
    return new mdb.Collapse(collapseEl, {
        toggle: false,
    });
});

function init() {
    const sidenav = document.getElementById("Side-nav");
    const sidenavInstance = mdb.Sidenav.getInstance(sidenav);
    getVideoList();
    getStreamList();
    getUser();
    getUserList();
    getAllWarn();
    setTimeout(() => {
        getAllImage();
    }, 2000)
    sidenavInstance.show();
}

init();

Router = async function (Data) {
    let Link = Data.getAttribute("data-route");
    let VideoId = Data.getAttribute("data-video");
    // console.log(Link, VideoId);
    // console.log(Data);
    switch (Link) {
        case "VideoFlow":
            collapseHide();
            loadPage(VideoFlowPage(globaldata.VideoList));
            VideoFlowInit();
            break;
        case "VideoAnysis":
            if (!VideoId) await getVideoImage(0);
            else await getVideoImage(VideoId);
            globaldata.VideoAnalyseList.VideoUrl = globaldata.VideoList[VideoId];
            loadPage(VideoAnalysePage(globaldata.VideoAnalyseList, VideoId));
            VideoAnalyseInit();
            break;
        case "VideoManage":
            collapseHide();
            //await getStreamList()
            loadPage(VideoManagePage());
            videoTable = VideoManageInit();
            break;
        case "UserManage":
            collapseHide();
            //await getUserList();
            loadPage(UserManagePage());
            userTable = UserManageInit();
            if (globaldata.User.role !== 1) {
                alert("您没有权限进行此操作！")
            }
            break;
        case "UserPannel":
            collapseHide();
            loadPage(UserPannelPage(globaldata.User));
            break;
        case "ImageManage":
            loadPage(ImageManagePage(globaldata.ImageList));
            break;
        case "WarnManage":
            loadPage(WarnManagePage());
            warnTable = WarnManageInit();
            break;
        default:
            break;
    }
};

function loadPage(page) {
    document.querySelector("#Content").innerHTML = page;
}

function VideoFlowInit() {
    for (let i = 0; i < globaldata.VideoList.length; i++) {
        let video = document.getElementById(`Video-preview-${i}`);
        if (video.dataset.protocol === 'RTSP') {
            console.log(`RTSP ${video.dataset.src}`);
            if (flvjs.isSupported()) {
                const flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: video.dataset.src,
                });
                flvPlayer.attachMediaElement(video);
                flvPlayer.load();
                flvPlayer.play();
            }
        }

    }
}

function VideoAnalyseInit() {
    const video = document.getElementById("Video-analyse");
    if (video.dataset.protocol === 'RTSP') {
        console.log(`RTSP ${video.dataset.src}`);
        if (flvjs.isSupported()) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: video.dataset.src,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
            flvPlayer.play();
        }
    }
}

function VideoManageInit() {
    const streamDatatable = document.getElementById("datatable");
    const setActions = () => {
        // 视频流更新按钮
        document.getElementsByClassName("update-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                let id = parseInt(btn.attributes["data-mdb-id"].value);
                console.log(`update Stream ${id}`);
                document.getElementById("upstreamid").value =
                    globaldata.StreamList.find((item) => item.id === id).id;
                document.getElementById("upstreamname").value =
                    globaldata.StreamList.find((item) => item.id === id).streamname;
                document.getElementById("upstreamurl").value =
                    globaldata.StreamList.find((item) => item.id === id).stream;
                updateModal.show();
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
        addModal.show();
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
    TableInstance.update(basicData, {loading: false});
    return TableInstance;
}

// 计算视频流数据
function CalcVideoData() {
    return {
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
}

//初始化用户表格
function UserManageInit() {
    const userDatatable = document.getElementById("usertable");
    const setActions = () => {
        // 用户更新按钮
        document.getElementsByClassName("update-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                let id = btn.attributes["data-mdb-id"].value;
                id = parseInt(id);
                console.log(`update User ${id}`);
                let user = globaldata.UserList.find(
                    (item) => {
                        return item.id === id;
                    }
                );
                document.getElementById("upuserid").value = user.id;
                document.getElementById("upusername").value = user.username;
                document.getElementById("upuserrole").value = user.role;
                userModal.show();
            });
        });
    };

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
    return {
        columns: [...globaldata.UserColumn],
        rows: [...globaldata.UserList].map((row) => {
            return {
                ...row,
                operation: `
    <button class="update-btn btn btn-outline-primary btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fas fa-edit"></i></button>`,
            };
        }),
    };
}

//初始化警告表格
function WarnManageInit() {
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
    const basicData = CalcWarnData();
    const TableInstance = new mdb.Datatable(
        document.getElementById("warntable"),
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

// 计算警告数据
function CalcWarnData() {
    return {
        columns: [...globaldata.WarningColumn],
        rows: [...globaldata.WarnList].map((row) => {
            return {
                ...row,
                operation: `
    <button class="delete-btn btn ms-2 btn-danger btn-floating btn-sm" data-mdb-id="${row.id}"><i class="fa fa-trash"></i></button>`,
            };
        }),
    };
}

function getVideoList() {
    // 从后端获取视频列表（axios)
    axios.get("/allvideolist").then((res) => {
        if (res.data.code === 200) {
            globaldata.VideoList = res.data.data;
        } else {
            console.log(res.data.msg);
        }
    });
}

async function getVideoImage(id) {
    // 从后端获取视频分析图像（axios)
    id = parseInt(id) + 1;
    await axios.get("/videoimage?videoid=" + id).then((res) => {
        if (res.data.code === 200) {
            globaldata.VideoAnalyseList.VideoAnalyseImage = [...res.data.data];
        } else {
            console.log(res.data.msg);
        }
    });
}

async function getStreamList() {
    // 从后端获取视频流列表（axios)
    await axios.get("/videolistquery").then((res) => {
        if (res.data.code === 200) {
            globaldata.StreamList = res.data.data;
            getVideoList()
            if (videoTable !== null) videoTable.update(CalcVideoData());
        } else {
            console.log(res.data.msg);
        }
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
            if (res.data.code === 200) {
                alert("修改成功");
                updateModal.hide();
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
            if (res.data.code === 200) {
                alert("添加成功");
                addModal.hide();
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
            if (res.data.code === 200) {
                alert("删除成功");
                getStreamList();
            } else {
                alert("删除失败");
            }
        });
}

async function getUserList() {
    // 从后端获取用户列表（axios)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + globaldata.Token;
    await axios.post("/userlistquery",).then((res) => {
        if (res.data.code === 200) {
            globaldata.UserList = res.data.data;
            globaldata.UserList.forEach((item) => {
                if (item.role === 1) item.role = "管理员";
                else item.role = "用户";
            });
            if (userTable !== null) userTable.update(CalcUserData());
        } else {
            console.log(res.data.msg);
        }
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
            if (res.data.code === 200) {
                alert("修改成功");
                userModal.hide();
                getUserList();
            } else {
                alert("修改失败");
            }
        });
}

function getUser() {
    // 从后端获取用户信息（axios)
    //发送token(Authorization bearer)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + globaldata.Token;
    axios.post("/userrole").then((res) => {
        if (res.data.code === 200) {
            globaldata.User.role = res.data.data[0];
        } else {
            console.log(res.data.msg);
        }
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
        if (res.data.msg === "success") {
            alert("设置成功");
        }
    });
}

async function getAllImage() {
    // 获取所有图片（axios)
    await axios.get("/imagelistquery").then((res) => {
        if (res.data.code === 200) {
            globaldata.ImageList = res.data.data;
        } else {
            console.log(res.data.msg);
        }
    });
}

function deleteImage(dom) {
    // 删除图片（axios)
    let id = dom.getAttribute("data-imageid");
    console.log(`delete image ${id}`);
    axios
        .post("/imagelistdelete", {
            imageid: id,
        })
        .then(async (res) => {
            console.log(res);
            if (res.data.code === 200) {
                alert("删除成功");
                await getAllImage();
                loadPage(ImageManagePage(globaldata.ImageList));
            } else {
                alert("删除失败");
            }
        });
}

async function getAllWarn() {
    // 获取所有报警信息（axios)
    await axios.get("/alertquery").then((res) => {
        if (res.data.code === 200) {
            globaldata.WarnList = res.data.data;
            if (warnTable) warnTable.update(CalcWarnData());
        } else {
            console.log(res.data.msg);
        }
    });
}

function tologin() {
    window.location.href = "http://127.0.0.1:8080";
}

function collapseHide() {
    collapseList.forEach(item => {
        item.hide();
    })
}