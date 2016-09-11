var N = 20;

function getCount(money){
    var count = 0;
	var arr = [100, 50, 20, 10, 5, 1];
	var rest = 0;

	for (var i = 0; i < 6; i++) {
		if (money % arr[i] === 0) {
		    count++;
		}
		if (money > arr[i]) {
			rest = money % arr[i];
			count = count + getCount(rest);
		}
	}
    console.log("总的组合: " + count);
    return count;
}

console.log(getCount(N));