<?php
class WxTmp
{
    //��¼
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
    //����ģ����Ϣ�ĵ�ַ
    const TEMP_URL = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=';
    public function getAccessToken(){
        //�����ȡaccesstoken  ������Լ��ĳ�������޸�
        $access_token = '16_HQgNBDfOnd6cqArsqNO757wITng7EP5aBbRczv7D9kQE7_x5Ju_plHKPbUDehuKaHBG1gJIw3Gs8z1afJWuWoOSnBsFcyVWbI4P-Ff0OCco1uyNPB_kThTJgP3WrD4xP6qEZ5XgnyEYsZV-6QPUfAGABAF';
        return $access_token;
    }
    /**
    * ΢��ģ����Ϣ����
    * @param $openid �����û���openid
    * return ���ͽ��
    */
    public function send($openid){
        $tokens = $this->getAccessToken();
        $url = self::TEMP_URL . $tokens;
        $params = [
            'touser' => $openid,
            'template_id' => 'Oblr5uXH_fS79gMC8E0mYz0CpUAHnJtdvAC3PWABrsk',//ģ��ID
            'url' => 'http://www.qhoa.net/index.php', //���������URL���Զ�̬����
            'data' => 
                    [
                      'first' => 
                         [
                            'value' => '����!�зÿͷø��������ˡ�',
                            'color' => '#173177'
                         ],
                      'user' => 
                         [
                            'value' => '����',
                            'color' => '#FF0000'
                         ],
 
                      'ask' => 
                         [
                                'value' => '����,�ǳ���ע��������,��û�й���֧��������Ƶ�̳�?',
                                'color' => '#173177'
                         ],
                       'remark' => 
                         [
                                'value' => '���û���ע��12��',
                                'color' => 'blue'
                         ] 
                      ]
        ]; 
        $json = json_encode($params,JSON_UNESCAPED_UNICODE);
        return $this->curlPost($url, $json);
    }
    /**
    * ͨ��CURL��������
    * @param $url �����URL��ַ
    * @param $data ���͵�����
    * return ������
    */
    protected function curlPost($url,$data)
    {
        $ch = curl_init();
        $params[CURLOPT_URL] = $url;    //����url��ַ
        $params[CURLOPT_HEADER] = FALSE; //�Ƿ񷵻���Ӧͷ��Ϣ
        $params[CURLOPT_SSL_VERIFYPEER] = false;
	    $params[CURLOPT_SSL_VERIFYHOST] = false;
        $params[CURLOPT_RETURNTRANSFER] = true; //�Ƿ񽫽������
        $params[CURLOPT_POST] = true;
        $params[CURLOPT_POSTFIELDS] = $data;
        curl_setopt_array($ch, $params); //����curl����
        $content = curl_exec($ch); //ִ��
        curl_close($ch); //�ر�����
        return $content;
    }
}
 
$obj = new WxTmp();
$openid = 'xu950403';
//echo $obj->login();
//exit();
echo $obj->send($openid);
