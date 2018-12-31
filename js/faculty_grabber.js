function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    var newWord = word.replace(word[0], word[0].toUpperCase());
    if(newWord.length == 1){
      return newWord + '.';
    }
    else {
      var hyphen = newWord.indexOf('-');
      var period = newWord.indexOf('.');
      if(period != -1 && newWord[period+1]) {
        newWord = newWord.replace(newWord[period+1], newWord[period+1].toUpperCase());
      }
      if(hyphen != -1) {
        newWord = newWord.replace(newWord[hyphen+1], newWord[hyphen+1].toUpperCase());
      }
    }
    return newWord;
  }).join(' ');
}

var uci_json;
var totalSalary = 0;
var names = [];
window.onload = function () {
  $('#loader').css("visibility", "visible");
  $('#filter-records').html('<h2>Loading over 28,000 faculty members...</h2>');
  $.getJSON('assets/uci.json', function(data) {
    uci_json = data;
    $('#txt-search').keyup();
    $('#loader').css("visibility", "hidden");
  });
}

$(function() {
  $('#txt-search').keyup(function(e) {
    $('#loader').css("visibility", "visible");
    var search_type;
    var radios = document.getElementsByName('search_type');
    for(var i = 0; i < radios.length; i++) {
      if(radios[i].checked) {
        search_type = radios[i].value;
      }
    }
    var searchField = $(this).val();

    // if(searchField === '') {
    //   $('#filter-records').html('');
    //   return;
    // }

    var search = searchField.trim();
    var regex = new RegExp(search, "i");
    var output = '<table id="uci">';
    output += '<tr><th>Rank</th><th>Name</th><th>Gross Pay</th><th>Regular Salary</th><th>Other Pay</th><th>Title(s)</th><th>Department(s)</th></tr>';
    var count = 1;

    $.each(uci_json, function(key, val) {
      if(count < 101 && ((search_type == 'name' && ((val.first_name.split(' ')[0].search(regex) != -1) || (val.last_name.search(regex) != -1) ||
                        ((val.first_name.split(' ')[0] + ' ' + val.last_name).search(regex) != -1))) ||
                        (search_type == 'dept' && ((val.department.search(regex) != -1) || (val.department2.search(regex) != -1))))) {
         output += '<tr>';
         output += '<td>' + (key+1) + '</td>';
         output += '<td>' + titleCase(val.first_name + ' ' + val.last_name) + '</td>';
         output += '<td>$' + val.gross_pay.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td>';
         output += '<td>$' + val.regular_pay.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td>';
         output += '<td>$' + val.other_pay.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td>';
         output += '<td>' + val.title;
         if(val.title2 != 'None' && val.title2.toLowerCase().indexOf("pager") == -1 && val.title2.toLowerCase().indexOf("phone") == -1) {
           output += ';</br>' + val.title2;
         }
         output += '</td>';
         output += '<td>' + val.department;
         if(val.department2 != 'None' && val.department2.toLowerCase().indexOf("pager") == -1 && val.department2.toLowerCase().indexOf("phone") == -1) {
           output += ';</br>'  + val.department2;
         }
         output += '</td>';
         output += '</tr>';
         count++;
      }
    });
    output += '</table>';
    $('#filter-records').html(output);
    $('#loader').css("visibility", "hidden");
  });
});
