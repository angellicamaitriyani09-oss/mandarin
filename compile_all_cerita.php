<?php
/**
 * Master Compiler Dataset Cerita Mandarin HSK 1 - 6
 * Menggabungkan seluruh data dari hsk1.php hingga hsk6.php
 * Serta secara otomatis menghasilkan anotasi Ruby (Pinyin di atas karakter Hanzi)
 */

$tonesMap = [
  'ā'=>'a','á'=>'a','ǎ'=>'a','à'=>'a',
  'ē'=>'e','é'=>'e','ě'=>'e','è'=>'e',
  'ī'=>'i','í'=>'i','ǐ'=>'i','ì'=>'i',
  'ō'=>'o','ó'=>'o','ǒ'=>'o','ò'=>'o',
  'ū'=>'u','ú'=>'u','ǔ'=>'u','ù'=>'u',
  'ǖ'=>'v','ǘ'=>'v','ǚ'=>'v','ǜ'=>'v','ü'=>'v',
  'Ā'=>'A','Á'=>'A','Ǎ'=>'A','À'=>'A',
  'Ē'=>'E','É'=>'E','Ě'=>'E','È'=>'E',
  'Ī'=>'I','Í'=>'I','Ǐ'=>'I','Ì'=>'I',
  'Ō'=>'O','Ó'=>'O','Ǒ'=>'O','Ò'=>'O',
  'Ū'=>'U','Ú'=>'U','Ǔ'=>'U','Ù'=>'U',
  'Ǖ'=>'V','Ǘ'=>'V','Ǚ'=>'V','Ǜ'=>'V','Ü'=>'V'
];

$rawSyllables = "a,ai,an,ang,ao,ba,bai,ban,bang,bao,bei,ben,beng,bi,bian,biao,bie,bin,bing,bo,bu,ca,cai,can,cang,cao,ce,cen,ceng,cha,chai,chan,chang,chao,che,chen,cheng,chi,chong,chou,chu,chua,chuai,chuan,chuang,chui,chun,chuo,ci,cong,cou,cu,cuan,cui,cun,cuo,da,dai,dan,dang,dao,de,dei,den,deng,di,dia,dian,diao,die,ding,diu,dong,dou,du,duan,dui,dun,duo,e,ei,en,eng,er,fa,fan,fang,fei,fen,feng,fo,fou,fu,ga,gai,gan,gang,gao,ge,gei,gen,geng,gong,gou,gu,gua,guai,guan,guang,gui,gun,guo,ha,hai,han,hang,hao,he,hei,hen,heng,hng,hong,hou,hu,hua,huai,huan,huang,hui,hun,huo,ji,jia,jian,jiang,jiao,jie,jin,jing,jiong,jiu,ju,juan,jue,jun,ka,kai,kan,kang,kao,ke,kei,ken,keng,kong,kou,ku,kua,kuai,kuan,kuang,kui,kun,kuo,la,lai,lan,lang,lao,le,lei,leng,li,lia,lian,liang,liao,lie,lin,ling,liu,lo,long,lou,lu,luan,lun,luo,lv,lve,ma,mai,man,mang,mao,me,mei,men,meng,mi,mian,miao,mie,min,ming,miu,mo,mou,mu,na,nai,nan,nang,nao,ne,nei,nen,neng,ni,nian,niang,niao,nie,nin,ning,niu,nong,nou,nu,nuan,nun,nuo,nv,nve,o,ou,pa,pai,pan,pang,pao,pei,pen,peng,pi,pian,piao,pie,pin,ping,po,pou,pu,qi,qia,qian,qiang,qiao,qie,qin,qing,qiong,qiu,qu,quan,que,qun,ran,rang,rao,re,ren,reng,ri,rong,rou,ru,rua,ruan,rui,run,ruo,sa,sai,san,sang,sao,se,sen,seng,sha,shai,shan,shang,shao,she,shei,shen,sheng,shi,shou,shu,shua,shuai,shuan,shuang,shui,shun,shuo,si,song,sou,su,suan,sui,sun,suo,ta,tai,tan,tang,tao,te,teng,ti,tian,tiao,tie,ting,tong,tou,tu,tuan,tui,tun,tuo,wa,wai,wan,wang,wei,wen,weng,wo,wu,xi,xia,xian,xiang,xiao,xie,xin,xing,xiong,xiu,xu,xuan,xue,xun,ya,yan,yang,yao,ye,yi,yin,ying,yo,yong,you,yu,yuan,yue,yun,za,zai,zan,zang,zao,ze,zei,zen,zeng,zha,zhai,zhan,zhang,zhao,zhe,zhei,zhen,zheng,zhi,zhong,zhou,zhu,zhua,zhuai,zhuan,zhuang,zhui,zhun,zhuo,zi,zong,zou,zu,zuan,zui,zun,zuo";
$sylList = explode(',', $rawSyllables);
$sylSet = array_flip($sylList);

function cleanWordToken($w) {
    return preg_replace('/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/u', '', $w);
}

function splitPinyinToSyllables($word, $sylSet, $tonesMap) {
    $word = cleanWordToken($word);
    if ($word === '') return [];

    $parts = explode("'", $word);
    if (count($parts) > 1) {
        $res = [];
        foreach ($parts as $p) {
            $sub = splitPinyinToSyllables($p, $sylSet, $tonesMap);
            $res = array_merge($res, $sub);
        }
        return $res;
    }

    $chars = preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY);
    $untonedChars = [];
    foreach ($chars as $c) {
        $untonedChars[] = strtolower($tonesMap[$c] ?? $c);
    }
    $untoned = implode('', $untonedChars);

    $solutions = [];
    $search = function($offset) use (&$search, &$solutions, $chars, $untonedChars, $untoned, $sylSet, &$current) {
        if ($offset >= count($chars)) {
            $solutions[] = $current;
            return;
        }
        $remain = count($chars) - $offset;
        $maxL = min(6, $remain);
        for ($l = $maxL; $l >= 1; $l--) {
            $cand = substr($untoned, $offset, $l);
            $nextChar = ($offset + $l < count($chars)) ? $untonedChars[$offset + $l] : '';

            $isMatch = isset($sylSet[$cand]);
            $isErHua = false;
            if (!$isMatch && substr($cand, -1) === 'r') {
                $base = substr($cand, 0, -1);
                if (isset($sylSet[$base]) && !in_array($nextChar, ['a', 'e', 'i', 'o', 'u', 'v'])) {
                    $isErHua = true;
                }
            }
            if ($isMatch || $isErHua) {
                $origSyl = implode('', array_slice($chars, $offset, $l));
                $current[] = $origSyl;
                $search($offset + $l);
                array_pop($current);
            }
        }
    };
    $current = [];
    $search(0);

    if (empty($solutions)) {
        return [$word];
    }
    return $solutions[0];
}

function generateRubyHtmlMarkup($cn, $pinyin, $sylSet, $tonesMap) {
    $cleanPy = str_replace(['-', '—'], ' ', $pinyin);
    $pyWords = preg_split('/\s+/u', trim($cleanPy), -1, PREG_SPLIT_NO_EMPTY);
    
    $pinyinSyllables = [];
    foreach ($pyWords as $pw) {
        $w = cleanWordToken($pw);
        if ($w === '') continue;
        $split = splitPinyinToSyllables($w, $sylSet, $tonesMap);
        foreach ($split as $s) {
            $pinyinSyllables[] = $s;
        }
    }

    $cnChars = preg_split('//u', $cn, -1, PREG_SPLIT_NO_EMPTY);
    $rubyParts = [];
    $sylIdx = 0;
    $totalSyls = count($pinyinSyllables);
    $nChars = count($cnChars);

    for ($i = 0; $i < $nChars; $i++) {
        $c = $cnChars[$i];
        $isHanzi = (bool)preg_match('/^[\x{4e00}-\x{9fa5}]$/u', $c);
        
        // Handle er-hua (e.g. 空儿 -> kòngr)
        if ($isHanzi && $i + 1 < $nChars && $cnChars[$i + 1] === '儿' && $sylIdx < $totalSyls) {
            $currSyl = $pinyinSyllables[$sylIdx];
            if (preg_match('/r$/i', $currSyl) && !preg_match('/^ér$/i', $currSyl)) {
                $rubyParts[] = "<ruby class=\"cerita-ruby\">" . htmlspecialchars($c . '儿', ENT_QUOTES, 'UTF-8') . "<rt>" . htmlspecialchars($currSyl, ENT_QUOTES, 'UTF-8') . "</rt></ruby>";
                $sylIdx++;
                $i++;
                continue;
            }
        }

        // Handle numeric sequences
        if (preg_match('/^[0-9]$/', $c)) {
            $numStr = $c;
            while ($i + 1 < $nChars && preg_match('/^[0-9]$/', $cnChars[$i + 1])) {
                $i++;
                $numStr .= $cnChars[$i];
            }
            $numSyls = [];
            if ($numStr === '20' && $sylIdx + 1 < $totalSyls) {
                $numSyls[] = $pinyinSyllables[$sylIdx++];
                $numSyls[] = $pinyinSyllables[$sylIdx++];
            } elseif ($numStr === '300' && $sylIdx + 1 < $totalSyls) {
                $numSyls[] = $pinyinSyllables[$sylIdx++];
                $numSyls[] = $pinyinSyllables[$sylIdx++];
            } elseif (($numStr === '2019' || $numStr === '2045') && $sylIdx + 3 < $totalSyls) {
                for ($k = 0; $k < 4; $k++) $numSyls[] = $pinyinSyllables[$sylIdx++];
            } elseif ($sylIdx < $totalSyls) {
                $numSyls[] = $pinyinSyllables[$sylIdx++];
            }
            $rtText = implode(' ', $numSyls);
            $rubyParts[] = "<ruby class=\"cerita-ruby\">" . htmlspecialchars($numStr, ENT_QUOTES, 'UTF-8') . "<rt>" . htmlspecialchars($rtText, ENT_QUOTES, 'UTF-8') . "</rt></ruby>";
            continue;
        }

        // Handle Latin alphabet words (e.g. AGI, L2)
        if (preg_match('/^[a-zA-Z]$/', $c)) {
            $alphaStr = $c;
            while ($i + 1 < $nChars && preg_match('/^[a-zA-Z0-9]$/', $cnChars[$i + 1])) {
                $i++;
                $alphaStr .= $cnChars[$i];
            }
            $rtText = '';
            if ($sylIdx < $totalSyls && strcasecmp(cleanWordToken($pinyinSyllables[$sylIdx]), $alphaStr) === 0) {
                $rtText = $pinyinSyllables[$sylIdx++];
            }
            if ($rtText !== '') {
                $rubyParts[] = "<ruby class=\"cerita-ruby\">" . htmlspecialchars($alphaStr, ENT_QUOTES, 'UTF-8') . "<rt>" . htmlspecialchars($rtText, ENT_QUOTES, 'UTF-8') . "</rt></ruby>";
            } else {
                $rubyParts[] = "<span class=\"cerita-non-hanzi\">" . htmlspecialchars($alphaStr, ENT_QUOTES, 'UTF-8') . "</span>";
            }
            continue;
        }

        if ($isHanzi) {
            $rtText = ($sylIdx < $totalSyls) ? $pinyinSyllables[$sylIdx++] : '';
            if ($rtText !== '') {
                $rubyParts[] = "<ruby class=\"cerita-ruby\">" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "<rt>" . htmlspecialchars($rtText, ENT_QUOTES, 'UTF-8') . "</rt></ruby>";
            } else {
                $rubyParts[] = "<ruby class=\"cerita-ruby\">" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "<rt></rt></ruby>";
            }
        } else {
            $rubyParts[] = "<span class=\"cerita-punct\">" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "</span>";
        }
    }

    return implode('', $rubyParts);
}

// 1. Load data cerita HSK 1 - 6
$hsk1 = require __DIR__ . '/cerita_source/hsk1.php';
$hsk2 = require __DIR__ . '/cerita_source/hsk2.php';
$hsk3 = require __DIR__ . '/cerita_source/hsk3.php';
$hsk4 = require __DIR__ . '/cerita_source/hsk4.php';
$hsk5 = require __DIR__ . '/cerita_source/hsk5.php';
$hsk6 = require __DIR__ . '/cerita_source/hsk6.php';

$allCerita = array_merge($hsk1, $hsk2, $hsk3, $hsk4, $hsk5, $hsk6);

echo "Jumlah Cerita Terkumpul: " . count($allCerita) . "\n";

// 2. Anotasikan Pinyin Ruby ke setiap judul dan paragraf cerita
foreach ($allCerita as $idx => &$story) {
    $qCount = count($story['questions']);
    echo "[" . ($idx + 1) . "] " . $story['id'] . " (" . $story['levelName'] . "): " . $story['titleCn'] . " - Soal: $qCount\n";
    if ($qCount !== 5) {
        die("ERROR: Cerita " . $story['id'] . " tidak memiliki 5 pertanyaan!\n");
    }

    // Judul Ruby
    $story['titleRubyHtml'] = generateRubyHtmlMarkup($story['titleCn'], $story['titlePinyin'], $sylSet, $tonesMap);

    // Paragraf Ruby
    foreach ($story['paragraphs'] as &$p) {
        $p['rubyHtml'] = generateRubyHtmlMarkup($p['cn'], $p['pinyin'], $sylSet, $tonesMap);
    }
    unset($p);
}
unset($story);

$jsonData = json_encode($allCerita, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$jsContent = "/**\n * Mandarinku - Data Kumpulan Cerita Panjang Mandarin HSK 1 - 6\n * Total: " . count($allCerita) . " Cerita Lengkap (3 Cerita x 6 Level HSK) dengan Anotasi Pinyin Ruby di atas Hanzi.\n */\nwindow.MandarinkuCeritaData = " . $jsonData . ";\n";

file_put_contents(__DIR__ . '/js/cerita-data.js', $jsContent);
echo "SUCCESS: Berhasil mengompilasi " . count($allCerita) . " cerita dengan anotasi Ruby ke js/cerita-data.js!\n";
