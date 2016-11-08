var provider = new firebase.auth.GithubAuthProvider();

var rowtempl = $("#rowtemplate").html()

firebase.initializeApp({
  apiKey: "AIzaSyATBmaeRou_6GE0qb7ziz1kpGn3hn9In28",
  authDomain: "voter-eda4a.firebaseapp.com",
  databaseURL: "https://voter-eda4a.firebaseio.com",
  messagingSenderId: "690434273617"
});

function setupAppForUser(name){
  $("#app").html( $("#votertemplate").html() )
  $("#add").click(function(){
    var roundname = $("#newround").val();
    firebase.database().ref('votes/'+roundname+'/'+name).set('undecided');
    $("#newround").val('')
  })
  firebase.database().ref('votes').on('value',function(snapshot){
    $("#rows").empty()
    _.each(snapshot.val(),function(votes,roundname){
      _.each(votes,function(fw,user){
        if(user===name){
          var row = $(rowtempl).addClass('voted'+fw).attr('data-roundname',roundname).find('.roundname').text(roundname).end()
          $("#rows").append(row)
        }
      })
    })
  })
  $("#rows").on("click",'button.voter',function(){
    var fw = $(this).attr("data-fw")
    var roundname = $(this).closest('.row').attr('data-roundname').toLowerCase()
    console.log("WAHA",roundname,fw)
    firebase.database().ref('votes/'+roundname+'/'+name).set(fw)
  })
  $("#rows").on("click",'button.del',function(){
    var roundname = $(this).closest('.row').attr('data-roundname')
    firebase.database().ref('votes/'+roundname+'/'+name).remove()
  })
}

$("#loginbtn").click(function(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var name = result.user.displayName;
    setupAppForUser(name)
  }).catch(function(error) {
    alert("Something went wrong :(")
  });
})
