function download(url, callback) {
  $.ajax({
    type: "POST",
    url: "/",
    data: {url: url},
    success: callback,
    error: function(err) {
      alert(err.msg);
    }
  });
}

$('#download').click(function(){
  const url = $("#url").val();
  if (!url) {
    alert("请输入图片网址");
    return;
  }
  toggleLoading(true);
  download(url, function(res) {
    toggleLoading(false);
    alert(res.msg)
  })
})

function toggleLoading(flag) {
  if (flag) {
    $('#loading').show();
    $('.modal').show();
  } else {
    $('#loading').hide();
    $('.modal').hide();
  }
}
