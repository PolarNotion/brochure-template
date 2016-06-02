import _ from 'underscore';
import moment from 'moment';
import 'bootstrap-sass';

console.log('Hello, World');

$('.toggle-sidebar').click(function (e) {
  e.preventDefault();
  console.log('toggle sidebar');
  $('#wrapper').toggleClass('toggled');
});
