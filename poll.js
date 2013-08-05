function initPoll(poll_id, tdelta, percentages, icons){
                var poll = document.getElementById(poll_id);
                var cup_image = document.createElement('img');
                cup_image.setAttribute('src', 'icon_pokal.png');
                cup_image.addEventListener('click', function(){
                    animatePoll(poll_id, percentages, icons, tdelta);
                });
                poll.appendChild(cup_image);
            }

            function appendIconCurry(iconContainer, iconSrc){
                return function(){
                    var icon = document.createElement('img');
                    icon.src = iconSrc;
                    icon.width = '32';
                    icon.height = '32';
                    iconContainer.appendChild(icon);
                }
            }

            function executeAllCurry(funs){
                return function(){
                    for(var i = 0; i < funs.length; i++){
                        funs[i]();
                    }
                }
            }

            function animatePoll(poll_id, percentages, icons, tdelta){
                var poll = document.getElementById(poll_id);
                poll.innerHTML = '';
                var table = document.createElement('table');
                var table_html = ''
                for(var i = 0; i < percentages.length; i++){
                    table_html += '<tr>';
                    table_html += '<td class="poll-perc" style="width:64px; font-size:32px; vertical-align:middle;"></td>';
                    table_html += '<td class="poll-icon" style="vertical-align:middle;"></td>';
                    table_html += '</tr>';
                }
                table.innerHTML = table_html;
                poll.appendChild(table);
                var iconContainers = document.querySelectorAll('#' + poll_id + ' .poll-icon');
                var percContainers = document.querySelectorAll('#' + poll_id + ' .poll-perc');
                var iconCounts = [];
                for(var i = 0; i < percentages.length; i++){
                    var n_icon = Math.ceil(percentages[i] / 5);
                    iconCounts.push(n_icon);
                }
                // create fun sequence
                var funlist = []
                while(true){
                    temp_funlist = [];
                    for(var i = 0; i < percentages.length; i++){
                        if(iconCounts[i] > 0){
                            temp_funlist.push(appendIconCurry(iconContainers[i], icons[i]));
                            iconCounts[i]--;
                        }
                    }
                    funlist.push(executeAllCurry(temp_funlist));                    
                    if(iconCounts.reduce(function(a, b){return a + b}) == 0){
                        break;
                    }
                }
                executeSequence(funlist, tdelta, function(){
                    for(var i = 0; i < percContainers.length; i++){
                        percContainers[i].innerHTML = percentages[i] + '%';
                    }
                });
            }

            function executeSequence(funlist, tdelta, callback){
                if(funlist.length == 0){
                    callback();                    
                }else{
                    setTimeout(function(){
                        funlist[0]();
                        executeSequence(funlist.slice(1), tdelta, callback);
                    }, tdelta);                    
                }                
            }