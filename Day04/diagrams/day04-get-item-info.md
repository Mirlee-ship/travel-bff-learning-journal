\# Day04锛氬晢鍝佽鎯呮帴鍙ｈ皟鐢ㄩ摼鍥?



\## getItemInfo 瀹屾暣璋冪敤閾?



```mermaid

flowchart TD

   A\["鐢ㄦ埛鍦ㄥ晢鍝佸垪琛ㄩ〉鐐瑰嚮鍟嗗搧"] --> B\["鍓嶇鎷垮埌 itemId"]

   B --> C\["POST /commodity/get-item-info"]

   C --> D\["鎵ц getItemInfo"]

   D --> E\["鏍规嵁 itemId 鏌ヨ鍟嗗搧鍩虹淇℃伅"]

   E --> F\["鏌ヨ鍟嗗搧鎵╁睍淇℃伅"]

   F --> G\["缁勮 basicInfo"]

   G --> H\["缁勮 extraInfo"]

   H --> I\["杩斿洖 basicInfo 鍜?extraInfo"]

   I --> J\["鍓嶇娓叉煋鍟嗗搧璇︽儏椤?]

```



\## 绠€鍖栫増璋冪敤閾?



```text

鍒楄〃椤电偣鍑诲晢鍝?

鈫?鎷垮埌 itemId

鈫?璇锋眰 get-item-info

鈫?鏌ヨ鍟嗗搧璇︽儏

鈫?缁勮 basicInfo + extraInfo

鈫?杩斿洖鍓嶇

鈫?娓叉煋璇︽儏椤?

```



\## 闈㈣瘯璁茶В閲嶇偣



1\. `getItemInfo` 鏄鎯呮帴鍙ｏ紝涓嶆槸鎼滅储鎺ュ彛銆?

2\. 瀹冨彧闇€瑕?`itemId`锛屽洜涓哄晢鍝佸凡缁忓湪鍒楄〃椤佃閫変腑浜嗐€?

3\. `basicInfo` 鏀惧晢鍝佸熀纭€瀛楁銆?

4\. `extraInfo` 鏀捐鎯呮墿灞曞瓧娈点€?

5\. 鎷嗘垚涓や釜妯″潡鏂逛究鍓嶇鎸夋ā鍧楁覆鏌擄紝涔熸柟渚垮悗缁墿灞曘€?


