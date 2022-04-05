# Home page redesign 
/public/mva/home-en.html

## Mark-up 
### HTML

#### Wrapper

```
<main role="main" property="mainContentOfPage" resource="#wb-main" class="container">	
	<h1 id="wb-cont" property="name" class="wb-inv">My Veteran Affairs Canada Account - Home page</h1>
	<div id="mva-dashboard" class="row">
        <div class="list-inline row cardsRow wb-eqht">
        	<h2>Menu</h2>
            <!-- home page navigation tiles -->
            <h2>News and Notifications</h2>
            <!-- news and notifcations tile -->
        </div>
    </div>
...
</main>
```

#### Home page tiles:

``` 
<div class="col-xs-12 col-sm-6 col-md-4">
	<details class="panel panel-default">
		<summary class="panel-heading eqht-trgt">
			<h3>{Category title}</h3>
            <p class="visible-sm visible-md visible-lg">{category description}</p>
		</summary>
		<div class="panel-body">
			<div class="list-group" id="{Category title}-menu" role="menu">
				<a class="list-group-item" href="#">{navigation item}</a>
			</div>
		</div>
	</details>
</div>
```

#### News & notifications:
``` 
<div class="col-xs-12 col-sm-12 col-md-6 col-md-offset-3">
	<details class="panel panel-default" open="open">
		<summary class="panel-heading eqht-trgt">
			<h3>{Category title}</h3>
		</summary>
		<div class="panel-body">
			<div class="list-group" id="{Category title}-menu" role="menu">
				<a class="list-group-item" href="#">{news item}</a>
			</div>
		</div>
	</details>
</div>
```

#### CSS:
```
/*
MVA Home page / dashboard 
*/
#mva-dashboard h2 {
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  margin: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
}

#mva-dashboard h3 {
  margin-top: 5px;
  display: inline-block;
}

#mva-dashboard summary p {
  margin: 0 16px 16px;
}

#mva-dashboard .cardsRow {
  margin-top: 18px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

#mva-dashboard details {
  padding-bottom: 0;
}

#mva-dashboard ul.list-group, #mva-dashboard div.list-group, #mva-dashboard details[open] > summary {
  margin-bottom: 0;
}

#mva-dashboard div.panel-body {
  padding: 0;
  margin: 0 -18px;
}

```