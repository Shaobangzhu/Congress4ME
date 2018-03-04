<?php    
    //判断如果是get请求，则进行执行操作
    $outputLCR = " ";
    if($_SERVER["REQUEST_METHOD"] == "GET") {
        //isset检测变量是否设置；empty判断值是否为空
        if(!isset($_GET["index"])||empty($_GET["index"])){
            echo "error";
            return;
        }
        if($_GET["index"] == 'legislator'){
            
            $myJsonFile = file_get_contents("http://congress.api.sunlightfoundation.com/legislators?apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=all");
            $outputLCR = utf8_encode($myJsonFile);
        
        } else if($_GET["index"] == 'house'){
            
            $lcrURL = "http://congress.api.sunlightfoundation.com/legislators?chamber=house&apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=all";
            $myJsonFile = file_get_contents($lcrURL);
            $outputLCR = utf8_encode($myJsonFile);
            
        } else if($_GET["type"] == 'bill'){
            
            $lcrURL = "http://congress.api.sunlightfoundation.com/bills?sponsor_id=".$_GET["index"]."&apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=5";
            $myJsonFile = file_get_contents($lcrURL);
            $outputLCR = utf8_encode($myJsonFile);
        
        } else if($_GET["index"] == 'active'){
            
           $myJsonFile = file_get_contents("http://congress.api.sunlightfoundation.com/bills?history.active=true&order=last_action_at&apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=50");
            $outputLCR = utf8_encode($myJsonFile);
            // Reference: https://sunlightlabs.github.io/congress/bills.html
        } else if($_GET["index"] == 'new'){
            
            $myJsonFile = file_get_contents("http://congress.api.sunlightfoundation.com/bills?history.active=false&order=last_action_at&apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=50");
            $outputLCR = utf8_encode($myJsonFile);
            
        } else if($_GET["index"] == 'comm'){
            
            $myJsonFile = file_get_contents("http://congress.api.sunlightfoundation.com/committees?apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=all");
            $outputLCR = utf8_encode($myJsonFile);
            
        } else {
            
            $lcrURL = "http://congress.api.sunlightfoundation.com/committees?member_ids=".$_GET["index"]."&apikey=a0f3846add744627a1dd1cbb0b3f337c&per_page=5";
            $myJsonFile = file_get_contents($lcrURL);
            $outputLCR = utf8_encode($myJsonFile);
            
        }
    }
    echo $outputLCR;
?>