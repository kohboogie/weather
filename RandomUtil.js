
var RandomUtil = {};

RandomUtil.pickRandom = function(pool, exceptions)
{
	if (exceptions != null)
	{
		var pool = pool.concat([]);
		for (var i = 0; i < pool.length; i++)
		{
			if (exceptions.indexOf(pool[pool.length - 1 - i]) > -1) pool.splice(pool.length - 1 - i, 1);
		}
	}
	return pool[Math.floor(Math.random() * pool.length)];
}

RandomUtil.getRandom = function(min, max, integer)
{
	var n = min + Math.random() * (max-min);
	if (integer) return Math.floor(n);
	else return n;
}