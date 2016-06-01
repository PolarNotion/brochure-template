import _ from 'underscore';
import moment from 'moment';
import 'bootstrap-sass';

console.log('Hello, World');

$('.toggle-sidebar').click(function (e) {
  e.preventDefault();
  console.log('toggle sidebar');
  $('#wrapper').toggleClass('toggled');
});

if ( $ || jquery === undefined ) {
  return "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>";
}