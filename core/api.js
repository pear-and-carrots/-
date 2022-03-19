import request from './request.js'
var userId = wx.getStorageSync('userId')
var signId = wx.getStorageSync('signIdd')
var coded = wx.getStorageSync('coded')
const baseUrl = getApp().globalData.baseUrl
// let app = getApp()
// 用户信息接口
// 用户登录
export function userLogin(data) {
  return request({
    url: `${baseUrl}/user/login`,
    method: 'POST',
    data
  })
}

// 用户注册
export function userRegister(data) {
  return request({
    url: `${baseUrl}/user/register`,
    method: 'POST',
    data
  })
}

// 查看用户信息
export function findUser(data) {
  return request({
    url: `${baseUrl}/user/` + userId,
    method: 'GET',
    data
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: `${baseUrl}/user/updateUser`,
    method: 'PUT',
    data
  })
}

// 删除用户信息
export function DeleteUser(data) {
  return request({
    url: `${baseUrl}/user/` + userId,
    method: 'DELETE',
    data
  })
}

// 我的发布
export function Userarticle(data) {
  return request({
    url: `${baseUrl}/user/article2/` + userId,
    method: 'GET',
    data
  })
}

// 我的收藏
export function userCollection(data) {
  return request({
    url: `${baseUrl}/user/collection/` + userId,
    method: 'GET',
    data
  })
}

// 我的用户信息以及数据锦集
export function myself(data) {
  return request({
    url: `${baseUrl}/user/myself/` + userId,
    method: 'GET',
    data
  })
}

// 从消息中看别人对我的评论,按时间顺序
export function peopleComment(data) {
  return request({
    url: `${baseUrl}/user/peopleComment/` + userId,
    method: 'GET',
    data
  })
}

// 从消息中看别人对我的点赞,按时间顺序
export function peopleSupport(data) {
  return request({
    url: `${baseUrl}/user/peopleSupport/` + userId,
    method: 'GET',
    data
  })
}

// 我的粉丝
export function support(data) {
  return request({
    url: `${baseUrl}/user/support/` + userId,
    method: 'GET',
    data
  })
}

// 消息中的点赞、评论红点数
export function tempSupport(data) {
  return request({
    url: `${baseUrl}/user/tempSupport/` + userId,
    method: 'GET',
    data
  })
}

// 点赞、收藏记录接口
// 文章的收藏
export function collectionArticle(data) {
  return request({
    url: `${baseUrl}/collection/article`,
    method: 'POST',
    data
  })
}

// 文章的点赞/取消接口
export function supportArticle(data) {
  return request({
    url: `${baseUrl}/collection/supportArticle`,
    method: 'POST',
    data
  })
}

// 文章的评论的点赞/取消接口
export function supportComment(data) {
  return request({
    url: `${baseUrl}/collection/supportComment`,
    method: 'POST',
    data
  })
}

// 文章信息接口
// 发布文章
export function putArticle(data) {
  return request({
    url: `${baseUrl}/article`,
    method: 'POST',
    data
  })
}

// 获取文章详情
export function getArticleDesc(data) {
  return request({
    url: `${baseUrl}/article2/getArticleDesc`,
    method: 'POST',
    data
  })
}

// 热搜
export function getArticleForHotKey(data) {
  return request({
    url: `${baseUrl}/article/getArticleForHotKey`,
    method: 'GET',
    data
  })
}

// 获取文章评论（详情页）
export function getCommentList(data) {
  return request({
    url: `${baseUrl}/article/getCommentList`,
    method: 'POST',
    data
  })
}

// 热门
export function getHotArticles(data) {
  return request({
    url: `${baseUrl}/article/getHotArticles`,
    method: 'GET',
    data
  })
}

// 最新
export function getNewArticles(data) {
  return request({
    url: `${baseUrl}/article/getNewArticles`,
    method: 'GET',
    data
  })
}

// 文件上传接口
export function insertFile(data) {
  return request({
    url: `${baseUrl}/article/insertFile`,
    method: 'POST',
    data
  })
}

// 根据标签推送文章
export function likeSign(data) {
  return request({
    url: `${baseUrl}/article2/likeSign`,
    method: 'GET',
    data
  })
}

// 发布一级评论
export function publishComment(data) {
  return request({
    url: `${baseUrl}/article/publishComment`,
    method: 'POST',
    data
  })
}

// 搜索框
export function selectArticleBykey(data) {
  return request({
    url: `${baseUrl}/article/selectArticleBykey`,
    method: 'POST',
    data
  })
}

// 猜你喜欢
export function selfLike(data) {
  return request({
    url: `${baseUrl}/article2/selfLike`,
    method: 'GET',
    data
  })
}

// 投诉接口
//查询投诉类型
export function getComplaintType(data) {
  return request({
    url: `${baseUrl}/complaint/getComplaintType`,
    method: 'GET',
    data
  })
}

// 上传投诉到管理端
export function insertComplaint(data) {
  return request({
    url: `${baseUrl}/complaint/insertComplaint`,
    method: 'POST',
    data
  })
}

// 我的界面中的，今日数据
// 我的界面：今日数据
export function readSupport(data) {
  return request({
    url: `${baseUrl}/Data/readSupport`,
    method: 'GET',
    data
  })
}

// 关注
// 首页部分：关注
export function followArticle(data) {
  return request({
    url: `${baseUrl}/article2/follow`,
    method: 'GET',
    data
  })
}

// 用户界面的关注功能，关注那个按钮点击时调用的接口
export function followPeople(data) {
  return request({
    url: `${baseUrl}/follow/followPeople`,
    method: 'POST',
    data
  })
}

// 我关注的人是否有发新文章,有多少篇未看的文章。
export function newMessage(data) {
  return request({
    url: `${baseUrl}/follow/newMessage/` + userId,
    method: 'GET',
    data
  })
}

// 我的关注
export function follow(data) {
  return request({
    url: `${baseUrl}/follow/people/` + userId,
    method: 'GET',
    data
  })
}

// 一级评论
// 获取某一大评论的详情页
export function FgetComment(data) {
  return request({
    url: `${baseUrl}/firstComment/getComment`,
    method: 'GET',
    data
  })
}

// 发布二级评论
export function publishSecondComment(data) {
  return request({
    url: `${baseUrl}/firstComment/publishSecondComment`,
    method: 'POST',
    data
  })
}

// 意见反馈
export function userSuggest(data) {
  return request({
    url: `${baseUrl}/suggest`,
    method: 'POST',
    data
  })
}

// 通过标签名查询文章
export function findSign(data) {
  return request({
    url: `${baseUrl}/sign/` + signId,
    method: 'GET',
    data
  })
}

// 查询所有的标签
export function getAllSign(data) {
  return request({
    url: `${baseUrl}/sign/getAllSign`,
    method: 'GET',
    data
  })
}

// 插入用户喜欢标签
export function putLikeSign(data) {
  return request({
    url: `${baseUrl}/sign/likeSign`,
    method: 'POST',
    data
  })
}

// 发布公告
export function putNotice(data) {
  return request({
    url: `${baseUrl}/notice`,
    method: 'POST',
    data
  })
}

// 获取公告列表
export function selectBycoded(data) {
  return request({
    url: `${baseUrl}/notice/selectBycoded/` + coded,
    method: 'GET',
    data
  })
}

// 消息推送官方的相关公告
export function gnotice(data) {
  return request({
    url: `${baseUrl}/notice/` + userId,
    method: 'GET',
    data
  })
}

// 公共栏(首页)
export function mnotice(data) {
  return request({
    url: `${baseUrl}/notice/main`,
    method: 'GET',
    data
  })
}

// 获取公告详情
export function noticeDesc(data) {
  return request({
    url: `${baseUrl}/notice/noticeDesc/` + userId,
    method: 'GET',
    data
  })
}

// 清除历史记录
export function deleteHistory(data) {
  return request({
    url: `${baseUrl}/history/deleteHistory/` + userId,
    method: 'DELETE',
    data
  })
}

// 搜索历史记录
export function getHistoryKey(data) {
  return request({
    url: `${baseUrl}/history/getHistoryKey/` + userId,
    method: 'GET',
    data
  })
}

// 增加历史记录
export function insertHistory(data) {
  return request({
    url: `${baseUrl}/history/insertHistory`,
    method: 'POST',
    data
  })
}

// 查询帮助文档
export function help(data) {
  return request({
    url: `${baseUrl}/help`,
    method: 'GET',
    data
  })
}

// 根据热搜
export function getArticleAndAuthorFromBySignByHot(data) {
  return request({
    url: `${baseUrl}/sign/getArticleAndAuthorFromBySignByHot/` + wx.getStorageSync('signId'),
    method: 'GET',
    data
  })
}

// 总排行榜
export function getUserOrdr(data) {
  return request({
    url: `${baseUrl}/user/getUserOrdr`,
    method: 'GET',
    data
  })
}

// 获取用户的文章
export function getUserArticle(data) {
  return request({
    url: `${baseUrl}/article2/getUserArticle`,
    method: 'GET',
    data
  })
}

// 获取用户的文章
export function getUserIndex(data) {
  return request({
    url: `${baseUrl}/user/getUserIndex`,
    method: 'GET',
    data
  })
}

// 获取文章详情(朋友圈)
export function getArticleDesc2(data) {
  return request({
    url: `${baseUrl}/article2/getArticleDesc2`,
    method: 'POST',
    data
  })
}

// 获取视频列表
export function getVideoList(data) {
  return request({
    url: `${baseUrl}/article2/getVideoList`,
    method: 'GET',
    data
  })
}

// 发布文章（普通帖子，图片）
export function insertArticle(data) {
  return request({
    url: `${baseUrl}/article2/insertArticle`,
    method: 'POST',
    data
  })
}

// 发布文章（视频）
export function insertArticleVideo(data) {
  return request({
    url: `${baseUrl}/article2/insertArticleVideo`,
    method: 'POST',
    data
  })
}

// 获取视频详情 （视频）
export function getArticleDesc3(data) {
  return request({
    url: `${baseUrl}/article2/getArticleDesc3`,
    method: 'POST',
    data
  })
}

// 查看文章的弹幕
export function getCreeping(data) {
  return request({
    url: `${baseUrl}/creeping/getCreeping`,
    method: 'GET',
    data
  })
}

// 发送弹幕
export function insertcreeping(data) {
  return request({
    url: `${baseUrl}/creeping/insertcreeping`,
    method: 'POST',
    data
  })
}

// 创建话题
export function home(data) {
  return request({
    url: `${baseUrl}/home`,
    method: 'POST',
    data
  })
}

// 加入群聊
export function enterHome(data) {
  return request({
    url: `${baseUrl}/home/enterHome`,
    method: 'GET',
    data
  })
}

// 获取话题列表
export function getHome(data) {
  return request({
    url: `${baseUrl}/home/getHome`,
    method: 'GET',
    data
  })
}

// 退出群聊
export function OutoftHome(data) {
  return request({
    url: `${baseUrl}/home/OutoftHome`,
    method: 'GET',
    data
  })
}

// 视频文件上传接口 
export function putVideo(data) {
  return request({
    url: `${baseUrl}/video`,
    method: 'POST',
    data
  })
}

// 删除文章 
export function deleteArticle(data) {
  return request({
    url: `${baseUrl}/article2/deleteArticle?ArticleId=` + data.ArticleId + `&UserId=` + wx.getStorageSync('userId'),
    method: 'delete',
    data
  })
}

// 查询用户喜欢标签 
export function getUserLikeSign(data) {
  return request({
    url: `${baseUrl}/sign2/getUserLikeSign`,
    method: 'GET',
    data
  })
}

// 修改用户喜欢的标签
export function updateLikeSign(data) {
  return request({
    url: `${baseUrl}/sign2/updateLikeSign`,
    method: 'POST',
    data
  })
}

// export function apiLogout() {
//   return request({
//     url: `${baseUrl}/suggest/addSuggest.do`,
//     method: 'delete'
//   })
// }
// export function apiLogout() {
//   return request({
//     url: `${baseUrl}/suggest/addSuggest.do`,
//     method: 'delete'
//   })
// }
// export function apiLogout() {
//   return request({
//     url: `${baseUrl}/suggest/addSuggest.do`,
//     method: 'delete'
//   })
// }

export function apiLogin(data) {
  return request({
    url: `${baseUrl}/user/login`,
    method: 'post',
    data
  })
}
export function apiGetUserInfo() {
  return request({
    url: `${baseUrl}/user/userInfo`,
    method: 'get'
  })
}
export function apiModifyUserPassword(data) {
  return request({
    url: `${baseUrl}/user/modifyPassword`,
    method: 'put',
    data
  })
}
export function apiLogout() {
  return request({
    url: `${baseUrl}/user/logout`,
    method: 'delete'
  })
}