var Main = (function(self) {
  var my = self
  var fn = {}

  fn.initModal = function() {
    console.log(123)
    $('#myModal').on('shown.bs.modal', function() {
      $('#myInput').trigger('focus')
    })
  }

  my.init = function() {
    $(document).ready(fn.initModal)
  }

  return my
})(Main || {})

Main.init()
