	var numberOfBaskets;
	var purpleberries = [];
	var capacity;
	var minCapacity;
	var maxCapacity;
	var dp = [];
	var walker;
	var alertClass;
	
	$(function() {
		initGame();
	});

	function initGame()
	{
		walker = 1;
		purpleberries = [];
		purpleberries.push(0);
		numberOfBaskets  = Math.floor(Math.random()*25+12);
		for(var i=1; i<=numberOfBaskets; i++)
		{
			var purpleberry = Math.floor(Math.random()*100+1);
			purpleberries.push(purpleberry);
			$('#number-'+i).val(purpleberry);
			$('#number-'+i).html(purpleberry);
			$('#number-'+i).removeClass('bg-purple');
			$('#number-'+i).removeClass('bg-green');
			$('#number-'+i).addClass('disabled');
			$('#number-'+i).addClass('bg-purple');
		}
		for(var i=numberOfBaskets+1; i<=36; i++)
		{
			$('#number-'+i).val(0);
			$('#number-'+i).html(0);
			$('#number-'+i).removeClass('bg-purple');
			$('#number-'+i).removeClass('bg-green');
			$('#number-'+i).addClass('disabled');
			$('#number-'+i).addClass('bg-purple');
		}
		minCapacity = Math.floor(40*numberOfBaskets/4);
		maxCapacity = 40*numberOfBaskets;
		capacity = Math.floor(Math.random()*(maxCapacity-minCapacity+1)+minCapacity);
		$('#capacity').html(capacity);
		$('#playerPurpleberries').html(0);
		$('#computerPurpleberries').html('Thinking...');

		$('#playDiv').removeClass('hidden');
		$('#choiceDiv').addClass('hidden');
		$('#textExcessive').addClass('hidden');
		$('#textResult').html('');	
		$('#alertResultDiv').removeClass(alertClass);
		$('#resultDiv').addClass('hidden');

		calculateAnswer();
	}	

	$('#readyButton').click(function(){
		$('#playDiv').addClass('hidden');
		$('#choiceDiv').removeClass('hidden');
		$('#textExcessive').addClass('hidden');

		$('#number-' + walker).removeClass('bg-purple');
		$('#number-' + walker).addClass('bg-orange');

		$('#choice').html($('#number-' + walker).val());
	});

	$('#takeButton').click(function(){
		$('#textExcessive').addClass('hidden');
		$('#textExcessive').html('');

		var currentPurpleberries = parseInt($('#playerPurpleberries').html());
		var takenPurpleberries = parseInt($('#number-' + walker).val());

		if(takenPurpleberries + currentPurpleberries <= capacity)
		{	
			$('#number-' + walker).removeClass('bg-orange');
			$('#number-' + walker).removeClass('disabled');
			$('#number-' + walker).addClass('bg-red');
			$('#playerPurpleberries').html(takenPurpleberries + currentPurpleberries)

			walker += 2;
			if(walker <= numberOfBaskets)
			{
				$('#number-' + walker).removeClass('bg-purple');
				$('#number-' + walker).addClass('bg-orange');			
				$('#choice').html($('#number-' + walker).val());	
			}
			else
			{
				$('#choiceDiv').addClass('hidden');
				getAnswer();
			}
		}
		else
		{
			$('#textExcessive').removeClass('hidden');
			$('#textExcessive').html("You can't take current purpleberries. Bucket limit exceeded!");
		}

		
	});

	$('#skipButton').click(function(){
		$('#textExcessive').addClass('hidden');
		$('#textExcessive').html('');

		$('#number-' + walker).removeClass('bg-orange');
		$('#number-' + walker).addClass('bg-purple');

		walker++;
		if(walker <= numberOfBaskets)
		{
			$('#number-' + walker).removeClass('bg-purple');
			$('#number-' + walker).addClass('bg-orange');			
			$('#choice').html($('#number-' + walker).val());	
		}
		else
		{
			$('#choiceDiv').addClass('hidden');
			getAnswer();
		}
	});

	function getAnswer()
	{
		var i = numberOfBaskets;
		var j = capacity;
		var temp = 0;
		while(i > 1)
		{
			if(j >= purpleberries[i])
			{
				if(dp[i][j]-dp[i-2][j-purpleberries[i]] == purpleberries[i])
				{
					if($('#number-'+i).hasClass('disabled'))
					{
						$('#number-'+i).removeClass('disabled');
						$('#number-'+i).removeClass('bg-purple');
						$('#number-'+i).addClass('bg-green');
					}
					else
					{
						$('#number-'+i).removeClass('bg-purple');
						$('#number-'+i).addClass('bg-orange');	
					}
					j -= purpleberries[i];
					temp += purpleberries[i];
					i -= 2;
				}
				else
				{
					i--;
				}
			}
			else
			{
				i--;
			}
		}
		if(i > 0)
		{
			if(dp[numberOfBaskets][capacity] != temp)
			{
				if($('#number-'+i).hasClass('disabled'))
				{
					$('#number-'+i).removeClass('disabled');
					$('#number-'+i).removeClass('bg-purple');
					$('#number-'+i).addClass('bg-green');
				}
				else
				{
					$('#number-'+i).removeClass('bg-purple');
					$('#number-'+i).addClass('bg-orange');	
				}
				temp += purpleberries[i];	
			}
		}
		$('#computerPurpleberries').html(temp);

		printResult();
	}

	function printResult()
	{
		var computerPurpleberries = parseInt($('#computerPurpleberries').html());
		var playerPurpleberries = parseInt($('#playerPurpleberries').html());
		alertClass = '';
		if(computerPurpleberries > playerPurpleberries)
		{
			$('#textResult').html('Cipio Wins!');
			alertClass = 'alert-success';
		}
		else if(computerPurpleberries < playerPurpleberries)
		{
			$('#textResult').html('You Win!');
			alertClass = 'alert-danger';
		}
		else
		{
			$('#textResult').html('It is a draw!');	
			alertClass = 'alert-info';
		}
		$('#alertResultDiv').addClass(alertClass);
		$('#resultDiv').removeClass('hidden');
	}

	$('#playAgainButton').click(function(){
		initGame();
	});

	function calculateAnswer()
	{
		dp = new Array(numberOfBaskets+2);
		for(var i=0; i<=numberOfBaskets; i++)
		{
			dp[i] = new Array(capacity+2);
		}

		for(var i=0; i<=numberOfBaskets; i++)
		{
			dp[i][0] = 0;
		}
		for(var i=0; i<=capacity; i++)
		{
			dp[0][i] = 0;
		}

		for(var i=1; i<=capacity; i++)
		{
			if(purpleberries[1] <= i)
			{
				dp[1][i] = purpleberries[1];
			}
			else
			{
				dp[1][i] = 0;
			}
		}

		for(var i=2; i<=numberOfBaskets; i++)
		{
			for(var j=1; j<=capacity; j++)
			{
				if(purpleberries[i] <= j)
				{
					dp[i][j] = Math.max(dp[i-1][j], purpleberries[i]+dp[i-2][j-purpleberries[i]]);
				}
				else
				{
					dp[i][j] = dp[i-1][j];
				}
			}
		}
	}

