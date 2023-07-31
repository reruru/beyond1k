const url = new URL('http://localhost/' + window.location.search);
//const url = window.location.search;
const url_param = url.searchParams;

function init_checklist(board) {
	console.log(board);
	console.log(url_param.get(board));
	if(url_param.get(board) == null) {
		$('#' + board).prop('checked', true);
	} else {
		$('#' + board).prop('checked', url_param.get(board) === 'true');
	}
	return $('#' + board).is(":checked")

}
let isd_check = init_checklist('isd');
let wak_check = init_checklist('wak');
let gomem_check = init_checklist('gomem');

let num_items = url_param.get('num_items')
if(num_items == null) {
	$('#num_items').val(15);
} else {
	$('#num_items').val(num_items);
}
num_items = $('#num_items').val();

let page_idx = url_param.get('page')
if(page_idx == null) {
	$('#page_idx').val(1);
} else {
	$('#page_idx').val(page_idx);
}
page_idx = $('#page_idx').val();

let page_offset = (page_idx - 1) % 10;
let page_start = page_idx - page_offset;
let base_url = '/?isd=' + isd_check + '&wak=' + wak_check + '&gomem=' + gomem_check + '&num_items=' + num_items
for(let i=0; i<10; i++) {
	if(i == page_offset) {
		$('#prev-next-10').append('<a href=\"' + base_url + '&page=' + (page_start + i) + '\" class=\'on\'>' + (page_start + i) + '</a>');
	} else {
		$('#prev-next-10').append('<a href=\"' + base_url + '&page=' + (page_start + i) + '\">' + (page_start + i) + '</a>');
	}
}
if(page_start > 10) {
	$('.prev-next').find('.pgL').attr('href', base_url + '&page=' + (page_start - 1));
}
$('.prev-next').find('.pgR').attr('href', base_url + '&page=' + (page_start + 10));



update();

function update() {
	let num_items = $('#num_items').val()
	let check_isd = $('#isd').is(":checked")
	let check_wak = $('#wak').is(":checked")
	let check_gomem = $('#gomem').is(":checked")
	let board_checklist = new Object();
	board_checklist.isd = check_isd;
	board_checklist.wak = check_wak;
	board_checklist.gomem = check_gomem;
	let page = $('#page_idx').val()

	getContents(num_items, board_checklist, page);
}

function get_levelicon(level_name) {
	if (level_name === "진드기") return 'https://cafe.pstatic.net/levelicon/1/1_110.gif';
	if (level_name === "닭둘기") return 'https://cafe.pstatic.net/levelicon/1/1_120.gif';
	if (level_name === "왁무새") return 'https://cafe.pstatic.net/levelicon/1/1_130.gif';
	if (level_name === "침팬치") return 'https://cafe.pstatic.net/levelicon/1/1_140.gif';
	if (level_name === "느그자") return 'https://cafe.pstatic.net/levelicon/1/1_150.gif';
}

function getContents(num_items, board_checklist, page) {
	console.log(num_items);
	console.log(board_checklist);
	console.log(page);
	let data = new Object();
	data.num_items = num_items;
	data.board_checklist = board_checklist;
	data.page = page;
	console.log(JSON.stringify(data));
	fetch("/view", {
		method: "POST",
		body: JSON.stringify(data),
	})
	.then(r => r.json())
	.then(d => {
		let items = d['items'];
		let len = d['len'];
		console.log('len: ' + len);
		$('#select-page').prepend(len + '페이지 중에서');
		//1페이지 정보만 보여준다
		//a href 링크들 다 끼워주고 내용들 맞게 넣어줘야 함
		let row = $('#sample_row');
		let num_items_per_page = $('#num_items').val();
		for(let i = 0; i < num_items_per_page; i++) {
			let new_row = row.clone();
			new_row.css('display', 'table-row');
			//let view_page_idx = page % 10;
			//let idx = num_items * (view_page_idx - 1) + i;
			let idx = i;
			
			new_row.find('.inner_number').text(items[idx][0])
			new_row.find('.inner_list').find('.article').attr('href', 'https://cafe.naver.com/steamindiegame/' + items[idx][0]);
			new_row.find('.inner_list').find('.article').html('<span class=\"head\">[' + items[idx][1][0] + ']</span> ' + items[idx][1][1]);
			new_row.find('.td_name').find('.m-tcol-c').text(items[idx][1][2]);
			new_row.find('.td_name').find('.mem-level').find('img').attr('src', get_levelicon(items[idx][1][3]));
			new_row.find('.td_date').text(items[idx][1][4]);

			$('#table_body').append(new_row);
		}
	})
	.catch((e) => {
	});
}

function goto_page() {
	let isd_check = $('#isd').is(":checked");
	let wak_check = $('#wak').is(":checked");
	let gomem_check = $('#gomem').is(":checked");

	let ni = $('#num_items').val();
	let pi = $('#page_idx').val();
	if(ni != num_items) pi = 1;


	let base_url = '/?isd=' + isd_check + '&wak=' + wak_check + '&gomem=' + gomem_check + '&num_items=' + ni + '&page=' + pi;
	console.log(base_url);
	location.href=base_url;
}
