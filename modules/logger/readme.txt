	TODO
	Development of loggin with maximum of code lines
	
	completedFirst:false
	limitLines 4 => if (limitLines < 2) return error
	linesIndexCount 0
	
	

	## First behaviour ##

	linesIndexCount 0
	lines.length 2
	
	a			
	--------------------
		if(!completedFirst) push
		else splice
		

		
	linesIndexCount 1
	lines.length 3
	
	a
	b
	------------------
		if(!completedFirst) push
		else splice
		
		

	linesIndexCount 2
	lines.length 4
	a
	b
	c
	-------------------
		if(!completedFirst) push
		else splice

	----------end function------------------------------------------------------------------------
		
		if(linesIndexCount+2<limitLines) linesIndexCount++
		else if( (linesIndexCount+2) == limitLines ) linesIndexCount=0, completedFirst = true
         ------------------------------------------------------------------------------------------------------

	
	## Second behaviour( completedFirst=true ) ##
	
	First case of second behaviour
	
	d
	-------------------------
		
	

	