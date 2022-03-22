(function(t){function e(e){for(var r,o,i=e[0],s=e[1],u=e[2],d=0,f=[];d<i.length;d++)o=i[d],c[o]&&f.push(c[o][0]),c[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);l&&l(e);while(f.length)f.shift()();return n.push.apply(n,u||[]),a()}function a(){for(var t,e=0;e<n.length;e++){for(var a=n[e],r=!0,i=1;i<a.length;i++){var s=a[i];0!==c[s]&&(r=!1)}r&&(n.splice(e--,1),t=o(o.s=a[0]))}return t}var r={},c={app:0},n=[];function o(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=t,o.c=r,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(a,r,function(e){return t[e]}.bind(null,r));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/projects/wipro-weather-widget/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],s=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var l=s;n.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"1a1e":function(t,e,a){},"2be3":function(t,e,a){"use strict";var r=a("848e"),c=a.n(r);c.a},3633:function(t,e,a){"use strict";var r=a("b339"),c=a.n(r);c.a},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("f751"),a("097d");var r=a("2b0e"),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrapper"},[a("TheLogo"),a("header",{staticClass:"intro"},[a("h1",[t._v("Going Somewhere?")]),a("p",[t._v("Get the current and five-day forecast for "),a("ApiRequestInput",{on:{forecast:function(e){t.forecastData=e},forecastError:function(e){t.forecastDataError=e}}}),t._v(" so you can, as the Boy Scouts say, "),a("strong",[t._v("be prepared.")])],1)]),t.forecastDataError?a("div",[a("BaseNotification",{attrs:{header:"Sorry Charlie",content:"Looks like that place only exists in your imagination. Try again!"}})],1):t.forecastData?a("div",[a("h2",{staticClass:"forecast-header"},[t._v("5-Day Forecast for "+t._s(t.forecastData.city.name)+", "+t._s(t.forecastData.city.country))]),a("div",{staticClass:"card-wrap"},t._l(t.filteredForecastData,function(e,r){return a("WeatherCard",t._b({key:r},"WeatherCard",e,!1))}),1),t._m(0)]):a("div",[a("BaseNotification",{attrs:{header:"Start Typing",content:"Waiting for you to enter something..."}})],1)],1)},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("p",{staticClass:"credit"},[t._v("\n\t\t\tWeather data courtesy of "),a("a",{attrs:{href:"https://openweathermap.org/"}},[t._v("Open Weather Map")])])}],o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("span",[a("input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{type:"text",placeholder:"any city in the world"},domProps:{value:t.location},on:{input:t.lookupWeather}})])},i=[],s=a("2ef0"),u=a("bc3a"),l={data:function(){return{apiKey:"b2763e469c8ae7d0017e29614b8b9cd7",forecastData:null,forecastDataError:null,location:""}},directives:{focus:{inserted:function(t){t.focus()}}},methods:{lookupWeather:s.debounce(function(t){var e=this;this.location=t.target.value,this.$emit("forecast",null),this.$emit("forecastError",null),t.target.value&&u.get("https://api.openweathermap.org/data/2.5/forecast?q="+t.target.value+"&units=imperial&APPID="+e.apiKey).then(function(t){e.forecastData=t.data,e.$emit("forecast",e.forecastData)}).catch(function(t){e.forecastDataError=t,e.$emit("forecastError",e.forecastDataError)})},500)}},d=l,f=(a("c410"),a("2877")),h=Object(f["a"])(d,o,i,!1,null,"25b963d8",null),v=h.exports,p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"notification"},[t.header?a("h2",[t._v(t._s(t.header))]):t._e(),a("p",[t._v(t._s(t.content))])])},m=[],y={props:{header:{type:String,required:!1},content:{type:String,required:!0}}},_=y,b=(a("2be3"),Object(f["a"])(_,p,m,!1,null,"7bec060f",null)),w=b.exports,g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("svg",{attrs:{id:"buildit-logotype",viewBox:"0 0 300 33",width:"100%",height:"100%"}},[a("path",{attrs:{d:"M60.144 24.383l-.18-2.035c-.419.778-1.137 1.376-1.975 1.795a6.023 6.023 0 0 1-2.633.599c-.957 0-1.795-.12-2.513-.42-.778-.299-1.377-.717-1.856-1.256-.718-.778-1.316-1.676-1.675-2.813a11.853 11.853 0 0 1-.539-3.59c0-1.317.18-2.574.599-3.71.419-1.138.957-2.095 1.735-2.873.479-.479 1.137-.838 1.795-1.137.719-.3 1.497-.419 2.454-.419.419 0 .838.06 1.317.18.419.12.837.239 1.256.418.42.18.778.42 1.137.659.36.299.599.598.838.957V2.36h2.574v22.023zm-.18-7.72c0-.958-.12-1.915-.359-2.753-.24-.838-.718-1.556-1.317-2.154-.299-.3-.658-.539-1.077-.719-.419-.18-.897-.299-1.436-.299-.838 0-1.556.18-2.154.539-.599.359-1.018.778-1.317 1.376-.3.599-.539 1.197-.658 1.915a12.92 12.92 0 0 0-.18 2.095c0 .718.06 1.436.18 2.094.12.718.359 1.317.658 1.915.3.599.778 1.018 1.317 1.377.598.359 1.256.538 2.154.538.598 0 1.077-.12 1.436-.299.42-.18.718-.419 1.077-.718.659-.599 1.078-1.257 1.317-2.154.24-.898.36-1.796.36-2.753zM34.231 5.353V2.3h2.992v3.052zm.18 19.03V8.943h2.633v15.44zm-20.766-7.72c0 1.256-.18 2.453-.54 3.59-.358 1.137-.957 2.035-1.675 2.813a5.656 5.656 0 0 1-1.855 1.257c-.718.299-1.556.419-2.513.419-.898 0-1.736-.18-2.634-.599-.897-.419-1.555-1.017-1.974-1.795l-.18 2.035H0V2.3h2.573v8.378c.18-.359.48-.658.838-.957.36-.3.718-.479 1.137-.658.42-.18.838-.3 1.257-.42.419-.119.898-.179 1.316-.179.898 0 1.736.12 2.454.42.718.298 1.317.657 1.795 1.136.778.778 1.377 1.676 1.736 2.873a13.05 13.05 0 0 1 .539 3.77zm-2.634 0c0-.718-.06-1.437-.18-2.095-.119-.718-.358-1.316-.657-1.915-.3-.598-.778-1.017-1.317-1.376-.598-.36-1.257-.539-2.154-.539-.599 0-1.078.12-1.437.3-.419.179-.718.418-1.077.718-.658.598-1.077 1.316-1.316 2.154-.24.838-.36 1.795-.36 2.753 0 .957.12 1.915.36 2.753.239.837.718 1.555 1.316 2.154.24.3.599.538 1.017.718.42.18.898.3 1.437.3.838 0 1.556-.18 2.154-.54.599-.358 1.017-.777 1.317-1.376.299-.598.538-1.197.658-1.915.18-.718.24-1.376.24-2.094zm16.218 7.72l-.24-2.334c-.418.897-1.017 1.556-1.914 2.034-.838.48-1.736.659-2.693.659-1.796 0-3.112-.48-3.95-1.496-.898-1.018-1.317-2.394-1.317-4.19V8.943h2.634v9.754c0 1.137.239 2.095.718 2.693.479.659 1.316.958 2.573.958.539 0 1.017-.12 1.436-.3.42-.239.778-.478 1.137-.837.48-.479.838-1.137 1.018-1.915.18-.778.299-1.556.299-2.334v-8.02h2.573v15.44zm19.689 0c-.12.06-.3.06-.479.12-.299.06-.778.119-1.376.119-1.137 0-1.975-.3-2.454-.958-.538-.658-.778-1.615-.778-2.812V2.3h2.574v18.253c0 .538.12.897.299 1.196.18.24.598.42 1.077.42h.838c.06 0 .18 0 .24-.06v2.274zm20.227-19.03V2.3h2.993v3.052zm.18 19.03V8.943h2.633v15.44zm15.56-.24c-.36.12-.778.18-1.257.3-.479.12-1.077.12-1.796.12-.837 0-1.496-.12-2.094-.36-.599-.24-.958-.539-1.317-.957-.299-.36-.538-.838-.658-1.317a6.523 6.523 0 0 1-.18-1.556v-9.216h-2.992V8.943h2.992v-3.95l2.574-.598v4.548h4.548v2.214h-4.548v8.917c0 .778.18 1.316.479 1.616.359.299.837.478 1.556.478.299 0 .598 0 .897-.06.3 0 .599-.06.838-.12l.898-.179v2.334zM115.68 12.773c0 .898-.12 1.855-.36 2.813-.24.957-.598 1.855-1.077 2.633s-1.137 1.436-1.915 1.974c-.778.54-1.736.778-2.873.778-.778 0-1.436-.18-1.974-.538-.539-.36-.898-.958-1.018-1.736-.299.719-.778 1.257-1.496 1.676a4.199 4.199 0 0 1-2.154.598c-.778 0-1.496-.12-2.095-.418-.598-.3-1.077-.719-1.496-1.197a4.874 4.874 0 0 1-.898-1.855 9.575 9.575 0 0 1-.299-2.334c0-.838.12-1.676.36-2.454.239-.778.598-1.436 1.076-1.975.48-.538 1.078-1.017 1.736-1.316.718-.36 1.496-.48 2.394-.48.598 0 1.137.12 1.675.42.539.299.958.658 1.257 1.197l.36-1.257h2.034l-.539 7.72v.658c0 .24.06.419.18.598.12.18.24.36.419.42.18.12.419.179.658.179.658 0 1.257-.24 1.676-.658.419-.42.837-.958 1.077-1.616.24-.658.479-1.257.598-1.975.12-.718.18-1.317.18-1.795 0-1.257-.18-2.394-.599-3.292-.359-.957-.897-1.735-1.615-2.453-.778-.778-1.736-1.377-2.873-1.796-1.137-.418-2.394-.598-3.83-.598s-2.693.24-3.89.658c-1.137.42-2.154 1.018-2.992 1.796a9.048 9.048 0 0 0-2.394 3.35c-.539 1.317-.838 2.873-.838 4.549 0 1.436.24 2.753.718 3.95.48 1.196 1.137 2.274 1.975 3.171.838.838 1.796 1.496 2.873 1.915 1.137.48 2.334.659 3.71.659 1.377 0 2.693-.12 3.89-.3a20.536 20.536 0 0 0 3.77-1.137v2.155c-1.197.598-2.453 1.017-3.77 1.197-1.257.239-2.573.299-3.95.299-1.675 0-3.171-.24-4.548-.778-1.376-.539-2.573-1.257-3.59-2.155a10.236 10.236 0 0 1-2.753-4.069c-.599-1.616-.898-3.291-.898-5.266 0-1.915.3-3.59.957-5.027.599-1.496 1.497-2.753 2.634-3.83 1.137-1.077 2.453-1.975 4.01-2.573 1.555-.599 3.23-.898 5.146-.898 1.735 0 3.351.3 4.847.838 1.436.539 2.693 1.316 3.77 2.394.898.897 1.616 1.915 2.095 3.112.419 1.137.658 2.513.658 4.069zm-9.336 1.676c0-.42-.06-.898-.12-1.317-.12-.419-.24-.778-.479-1.137-.24-.3-.479-.599-.838-.778-.359-.18-.778-.3-1.316-.3-.539 0-1.018.12-1.377.42-.359.239-.658.598-.897 1.017-.24.419-.42.838-.48 1.317-.119.478-.119.957-.119 1.436 0 .419.06.838.12 1.257.06.418.24.837.419 1.137.18.359.478.598.778.837.359.24.778.3 1.256.3.599 0 1.137-.12 1.497-.36.359-.239.718-.598.957-1.017.24-.419.419-.838.479-1.376.06-.42.12-.958.12-1.436zM235.129 2.3h3.052v3.052h-3.052zm0 22.083v-15.5h3.052v15.5zM258.767 2.3h3.052v3.052h-3.052zm0 22.083v-15.5h3.052v15.5zm-30.102-2.035a4.776 4.776 0 0 1-1.974 1.795 6.023 6.023 0 0 1-2.634.599c-.957 0-1.795-.12-2.513-.42a5.656 5.656 0 0 1-1.855-1.256c-.718-.778-1.317-1.676-1.676-2.813a11.853 11.853 0 0 1-.538-3.59c0-1.377.18-2.574.598-3.77.419-1.137.958-2.095 1.735-2.873.54-.479 1.138-.838 1.796-1.137.718-.3 1.496-.419 2.453-.419.42 0 .838.06 1.317.18.419.12.838.24 1.257.419.419.18.778.419 1.137.718s.598.598.838.957V2.3h2.633v22.142l-2.394-.06zm0-5.685c0-.958-.12-1.915-.359-2.753a4.088 4.088 0 0 0-1.376-2.154c-.3-.3-.658-.539-1.077-.719-.42-.18-.898-.299-1.436-.299-.838 0-1.556.18-2.155.539a3.794 3.794 0 0 0-1.376 1.376 9.071 9.071 0 0 0-.718 1.915 13.083 13.083 0 0 0 0 4.309c.12.718.359 1.316.718 1.915.299.598.778 1.017 1.376 1.376.599.36 1.317.539 2.155.539.598 0 1.077-.12 1.436-.3.419-.179.778-.418 1.077-.717.658-.599 1.077-1.317 1.376-2.155.24-.957.36-1.915.36-2.872zm27.05 10.053c0 .659-.12 1.257-.359 1.796-.24.538-.539.957-.957 1.316-.36.36-.778.659-1.317.898a6.836 6.836 0 0 1-1.556.539c-.539.12-1.137.239-1.676.299-.598.06-1.137.06-1.675.06-.539 0-1.018 0-1.556-.06-.539-.06-1.077-.12-1.556-.3a6.367 6.367 0 0 1-1.496-.538 4.792 4.792 0 0 1-1.257-.898c-.3-.299-.598-.718-.778-1.137-.18-.478-.3-.957-.3-1.616 0-.837.24-1.496.66-2.094a4.084 4.084 0 0 1 1.555-1.317c-.539-.18-.957-.538-1.317-1.017-.359-.479-.478-1.017-.478-1.616 0-.718.18-1.316.598-1.795.36-.539.898-.898 1.496-1.197a5.023 5.023 0 0 1-1.316-1.855c-.3-.718-.48-1.436-.48-2.154 0-.838.12-1.556.42-2.155a4.782 4.782 0 0 1 1.077-1.616c.539-.538 1.197-.957 1.915-1.316.718-.3 1.616-.479 2.693-.479.718 0 1.376.06 1.975.24.598.18 1.137.359 1.556.658.24-.718.658-1.257 1.257-1.616.538-.359 1.196-.539 1.974-.539h.36c.12 0 .239 0 .359.06v2.095c-.06 0-.18-.06-.3-.06h-.299c-.538 0-.957.12-1.257.359-.359.24-.538.598-.598 1.017.3.42.598.898.778 1.377.18.538.24 1.137.24 1.795 0 .718-.12 1.436-.36 2.035-.24.658-.598 1.197-1.017 1.675-.539.539-1.137 1.018-1.915 1.317-.778.359-1.676.479-2.693.479a7.62 7.62 0 0 1-1.317-.12c-.359-.06-.778-.18-1.256-.36-.3.12-.599.24-.898.48-.3.24-.419.538-.419.897 0 .36.06.599.24.838.179.18.358.36.538.479.24.12.479.18.778.24.3.06.539.06.778.06h3.052c.898 0 1.855.119 2.813.358.957.24 1.735.658 2.334 1.317.359.359.658.778.897 1.316-.06.599.06 1.197.06 1.855zm-2.573 0c0-.598-.12-1.017-.36-1.376-.239-.3-.598-.598-.957-.718-.419-.18-.838-.24-1.316-.3-.48-.06-.958-.06-1.437-.06h-3.59a3.07 3.07 0 0 0-1.377.899c-.359.418-.598.957-.598 1.555 0 .659.24 1.197.658 1.616.24.24.539.42.898.599.359.12.718.239 1.077.299.36.06.718.12 1.137.12.36 0 .718.06 1.077.06.3 0 .659 0 1.077-.06.36 0 .778-.06 1.138-.18.359-.06.778-.18 1.077-.359.359-.12.658-.36.897-.598.42-.36.599-.898.599-1.497zm-1.795-12.686c0-.958-.3-1.796-.958-2.454-.598-.658-1.496-.957-2.573-.957-1.078 0-1.915.299-2.574.957-.658.658-.957 1.436-.957 2.454 0 .957.3 1.795.957 2.453.599.658 1.496 1.018 2.574 1.018 1.077 0 1.915-.36 2.573-1.018.658-.658.958-1.496.958-2.453zm23.04 10.472c-.48.12-1.137.12-1.796.12-.838 0-1.556-.12-2.094-.36-.539-.239-.958-.538-1.317-.957-.3-.359-.538-.837-.658-1.316a6.523 6.523 0 0 1-.18-1.556v-9.276h-2.992V8.943h2.992v-4.01l2.633-.598v4.548h4.608v2.214h-4.608v8.977c0 .778.18 1.316.48 1.616.358.299.837.478 1.555.478.3 0 .599 0 .898-.06.3 0 .598-.06.838-.12l.897-.179v2.394c-.359.12-.778.18-1.256.3zm18.671-.24c-.3.12-.539.24-.838.3-.24.06-.538.06-.897.06-.719 0-1.257-.24-1.616-.718-.42-.479-.599-1.018-.599-1.676h-.06c-.478.778-1.137 1.377-2.034 1.855-.898.48-1.855.718-2.992.718-.898 0-1.676-.12-2.334-.418a6.718 6.718 0 0 1-1.676-1.078c-.419-.478-.778-.957-1.017-1.556-.24-.598-.36-1.137-.36-1.735 0-.479.06-1.017.24-1.556.18-.539.479-1.077.898-1.496.419-.479 1.017-.838 1.675-1.197a8.13 8.13 0 0 1 2.633-.598l4.728-.3V13.73c0-.359-.06-.778-.12-1.196-.12-.42-.299-.778-.658-1.138-.24-.239-.598-.418-1.017-.598a5.312 5.312 0 0 0-1.556-.24c-.718 0-1.317.06-1.736.24-.478.18-.778.419-1.077.658-.538.539-.778 1.137-.778 1.855h-2.573c0-.718.12-1.316.359-1.855.24-.538.539-.957.957-1.376.539-.539 1.197-.958 2.095-1.257.838-.299 1.735-.419 2.693-.419 1.496 0 2.693.3 3.59.838.898.539 1.497 1.257 1.856 2.154.299.719.479 1.497.479 2.394v7.48c0 .42.06.659.239.838.18.12.359.24.598.24h.24c.06 0 .18 0 .24-.06l.239-.06v2.035zm-8.318-7.12a4.47 4.47 0 0 0-2.274.658c-.3.24-.599.478-.778.838-.18.359-.3.778-.3 1.256 0 .718.24 1.317.719 1.855.478.539 1.256.838 2.333.838a5.56 5.56 0 0 0 1.736-.299c.539-.18 1.017-.539 1.436-.957.479-.48.778-1.018 1.018-1.616.18-.599.299-1.257.299-1.915v-.898zm15.26 7.24c-.12.06-.3.06-.479.12-.299.06-.778.12-1.376.12-1.137 0-1.975-.3-2.454-.958-.538-.658-.778-1.615-.778-2.812V2.3h2.633v18.372c0 .539.12.958.3 1.197.18.24.598.419 1.077.419h.838c.06 0 .18 0 .239-.06zM200.12 7.567c-4.608 0-8.379 3.89-8.379 8.617 0 4.787 3.77 8.617 8.379 8.617 4.608 0 8.378-3.89 8.378-8.617.06-4.728-3.71-8.617-8.378-8.617m0 13.225c-2.394 0-4.31-2.035-4.31-4.548 0-2.514 1.916-4.548 4.31-4.548 2.393 0 4.308 2.034 4.308 4.548 0 2.513-1.915 4.548-4.308 4.548M147.457 8.045h-3.112c-.24 0-.539.18-.599.479l-2.573 7.9-4.369-8.439c-.12-.239-.419-.418-.718-.418h-.299c-.24 0-.598.179-.718.418l-4.369 8.438-2.573-7.899c-.06-.24-.36-.479-.599-.479h-3.111c-.42 0-.599.3-.48.659l5.028 15.679c.06.239.359.478.598.478h.479c.24 0 .598-.18.718-.419l5.147-9.934 5.146 9.934c.12.24.42.42.718.42h.48c.239 0 .538-.18.598-.48l5.027-15.678c.18-.3-.06-.659-.42-.659m7.182 0h-3.112c-.419 0-.718.3-.718.718v14.901c0 .42.3.719.718.719h3.112c.419 0 .718-.3.718-.719v-14.9c0-.36-.3-.719-.718-.719m13.644-.478c-2.154 0-4.069.957-5.505 2.453l-.539-1.496c-.12-.24-.359-.479-.658-.479h-1.436c-.42 0-.719.3-.719.718v23.519c0 .419.3.718.719.718h3.112c.418 0 .718-.3.718-.718v-8.139c1.316.479 2.753.718 4.308.718 4.37 0 7.9-3.89 7.9-8.617 0-4.788-3.53-8.677-7.9-8.677m-.837 13.225a7.11 7.11 0 0 1-3.471-.898v-6.223c.778-1.197 2.034-2.035 3.47-2.035 2.335 0 4.19 2.035 4.19 4.548 0 2.573-1.855 4.608-4.19 4.608m20.288-13.225c-2.992 0-4.728 2.453-4.728 2.453l-.538-1.496c-.12-.24-.36-.479-.659-.479h-1.496c-.419 0-.718.3-.718.718v14.901c0 .42.3.719.718.719h3.112c.419 0 .718-.3.718-.719V13.252c1.796-2.215 4.13-1.437 4.608-1.257.479.18.838-.06.958-.36.12-.298.838-1.854 1.077-2.453.3-.538-.06-1.615-3.052-1.615M153.74.385c-1.316-.359-2.753.42-3.112 1.796-.359 1.316.42 2.752 1.796 3.111 1.316.36 2.753-.418 3.112-1.795.359-1.316-.42-2.753-1.796-3.112"}})])},D=[],z={},C=z,O=(a("3633"),Object(f["a"])(C,g,D,!1,null,null,null)),j=O.exports,M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("article",{staticClass:"weather-card",class:t.formattedType},[a("div",{staticClass:"weather-card__inner"},[a("div",{staticClass:"weather-conditions"},[a("span",{staticClass:"weather-type"},[t._v(t._s(t.weather[0].main))]),a("span",{staticClass:"weather-temp"},[t._v(t._s(t.formattedTemp)+"°")])]),a("div",{staticClass:"weather-meta"},[a("header",[a("span",{staticClass:"weather-day"},[t._v(t._s(t.formattedDay))]),a("h1",[t._v(t._s(t.formattedMonth)+" "+t._s(t.formattedDate))])]),a("dl",[a("div",{attrs:{title:"Cloud Cover"}},[a("dt",{staticClass:"clouds"},[t._v("Cloud Cover")]),a("dd",[t._v(t._s(t.clouds.all)+"%")])]),a("div",{attrs:{title:"Wind speed and direction"}},[a("dt",{staticClass:"wind"},[t._v("Wind")]),a("dd",[t._v(t._s(t.formattedWindSpeed)+" mph / "+t._s(t.formattedWindDirection)+"°")])]),a("div",{attrs:{title:"Humidity"}},[a("dt",{staticClass:"humidity"},[t._v("Humidity")]),a("dd",[t._v(t._s(t.main.humidity)+"%")])])])])])])},T=[],x=(a("c5f6"),{computed:{formattedDate:function(){return this.dateTime.getDate()},formattedDay:function(){return(new Date).getDay()===this.dateTime.getDay()?"Today":this.dateTime.toLocaleString("default",{weekday:"short"})},formattedMonth:function(){return this.dateTime.toLocaleString("default",{month:"long"})},formattedTemp:function(){return Math.round(this.main.temp)},formattedType:function(){return"weather-card--"+this.weather[0].main.toLowerCase()},formattedWindDirection:function(){return Math.round(this.wind.deg)},formattedWindSpeed:function(){return this.wind.speed.toFixed(1)}},data:function(){return{dateTime:new Date(1e3*this.dt)}},props:{clouds:Object,dt:{type:Number,required:!0},main:{type:Object,required:!0},weather:{type:Array,required:!0},wind:Object}}),E=x,S=(a("f317"),Object(f["a"])(E,M,T,!1,null,"5bc42f20",null)),V=S.exports,W={components:{BaseNotification:w,ApiRequestInput:v,TheLogo:j,WeatherCard:V},computed:{filteredForecastData:function(){return this.forecastData.list.filter(function(t,e){return e%8===0})}},data:function(){return{forecastData:null,forecastDataError:null}}},$=W,k=(a("5c0b"),Object(f["a"])($,c,n,!1,null,null,null)),P=k.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(t){return t(P)}}).$mount("#app")},"5c0b":function(t,e,a){"use strict";var r=a("5e27"),c=a.n(r);c.a},"5e27":function(t,e,a){},"848e":function(t,e,a){},"952a":function(t,e,a){},b339:function(t,e,a){},c410:function(t,e,a){"use strict";var r=a("1a1e"),c=a.n(r);c.a},f317:function(t,e,a){"use strict";var r=a("952a"),c=a.n(r);c.a}});
//# sourceMappingURL=app.ccef5bf4.js.map