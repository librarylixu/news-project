<?php
class WxTmp
{
    //登录
    public function login(){
        $appid = 'wx07e011e2c66479f1';
        $secret = '4c103e7be1971f9b24d81e974c6836b8';
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" . $appid . "&secret=" . $secret . "";
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_POST, 1); 
        curl_setopt($ch, CURLOPT_HEADER, 0); 
        curl_setopt($ch, CURLOPT_URL, $url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
        $result = curl_exec($ch); 
        curl_close($ch); 
        print_r(json_decode($result, true));
    }
    //请求模板消息的地址
    const TEMP_URL = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=';
    public function getAccessToken(){
        //这里获取accesstoken  请根据自己的程序进行修改
        $access_token = '16_HQgNBDfOnd6cqArsqNO757wITng7EP5aBbRczv7D9kQE7_x5Ju_plHKPbUDehuKaHBG1gJIw3Gs8z1afJWuWoOSnBsFcyVWbI4P-Ff0OCco1uyNPB_kThTJgP3WrD4xP6qEZ5XgnyEYsZV-6QPUfAGABAF';
        return $access_token;
    }
    /**
    * 微信模板消息发送
    * @param $openid 接收用户的openid
    * return 发送结果
    */
    public function send($openid){
        $tokens = $this->getAccessToken();
        $url = self::TEMP_URL . $tokens;
        $params = [
            'touser' => $openid,
            'template_id' => 'Oblr5uXH_fS79gMC8E0mYz0CpUAHnJtdvAC3PWABrsk',//模板ID
            'url' => 'http://www.qhoa.net/index.php', //点击详情后的URL可以动态定义
            'data' => 
                    [
                      'first' => 
                         [
                            'value' => '您好!有访客访给您留言了。',
                            'color' => '#173177'
                         ],
                      'user' => 
                         [
                            'value' => '张三',
                            'color' => '#FF0000'
                         ],
 
                      'ask' => 
                         [
                                'value' => '您好,非常关注黎明互联,有没有关于支付宝的视频教程?',
                                'color' => '#173177'
                         ],
                       'remark' => 
                         [
                                'value' => '该用户已注册12天',
                                'color' => 'blue'
                         ] 
                      ]
        ]; 
        $json = json_encode($params,JSON_UNESCAPED_UNICODE);
        return $this->curlPost($url, $json);
    }
    /**
    * 通过CURL发送数据
    * @param $url 请求的URL地址
    * @param $data 发送的数据
    * return 请求结果
    */
    protected function curlPost($url,$data)
    {
        $ch = curl_init();
        $params[CURLOPT_URL] = $url;    //请求url地址
        $params[CURLOPT_HEADER] = FALSE; //是否返回响应头信息
        $params[CURLOPT_SSL_VERIFYPEER] = false;
	    $params[CURLOPT_SSL_VERIFYHOST] = false;
        $params[CURLOPT_RETURNTRANSFER] = true; //是否将结果返回
        $params[CURLOPT_POST] = true;
        $params[CURLOPT_POSTFIELDS] = $data;
        curl_setopt_array($ch, $params); //传入curl参数
        $content = curl_exec($ch); //执行
        curl_close($ch); //关闭连接
        return $content;
    }
}
 
$obj = new WxTmp();
$openid = 'xu950403';
//echo $obj->login();
//exit();
echo $obj->send($openid);
