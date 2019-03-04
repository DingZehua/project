//输出字谜中的单词  
    public static void outPutlogoGriph(String temp,String[] logogriph){  
        for(int k=0;k<logogriph.length;k++){  
            if(temp.indexOf(logogriph[k])>=0){  
                System.out.println(logogriph[k]);  
            }  
        }  
    }  
    //比较字谜中的单词  
    public static void getLogoGriph(String[][] s,String[] logogriph){  
        String temp = "";  
        // 查找水平方向上的单词,从左往右的方向  
        for(int i=0;i<s.length;i++){  
            //正序的  
            temp  = "";  
            for(int j=0;j<s[i].length;j++){  
                temp += s[i][j];  
            }  
            //比较,并输出字谜中的单词  
            outPutlogoGriph(temp,logogriph);  
            //逆序的  
            temp  = "";  
            for(int j=s[i].length-1;j>=0;j--){  
                temp += s[i][j];  
            }  
            //比较,并输出字谜中的单词  
            outPutlogoGriph(temp,logogriph);  
        }  
//       查找垂直方向上的单词,从上往下的方向  
//       查找垂直方向上的单词,从下往上的方向  
        temp = "";  
        for(int i=0;i<s[0].length;i++){  
            //上下方向的  
            temp = "";  
            for(int j=0;j<s.length;j++){  
                temp += s[j][i];  
            }  
            //比较,并输出字谜中的单词  
            outPutlogoGriph(temp,logogriph);  
            //下上方向的  
            temp = "";  
            for(int j=s.length-1;j>=0;j--){  
                temp += s[j][i];  
            }  
            //比较,并输出字谜中的单词  
            outPutlogoGriph(temp,logogriph);  
        }  
        //查找第一条对角线（从上往下的对角线）上的单词,正方向(针对的是规则的二维数组)  
        temp = "";  
        for(int i=0;i<s.length;i++){  
            temp += s[i][i];  
        }  
        //正向的  
        //比较,并输出字谜中的单词  
        outPutlogoGriph(temp,logogriph);  
        // 查找对角线上的单词,反方向  
        temp = "";  
        for(int i= s.length-1;i>=0;i--){  
            temp += s[i][i];  
        }  
        //比较,并输出字谜中的单词  
        outPutlogoGriph(temp,logogriph);  
        //查找第二条对角线,从下往上的对角线  
        temp = "";  
        for(int i=0;i<s.length;i++){  
            temp += s[s.length-i-1][i];  
        }  
        //正向的(斜向上)  
        //比较,并输出字谜中的单词  
        outPutlogoGriph(temp,logogriph);  
        temp = "";  
        for(int i=0;i<s.length;i++){  
            temp += s[i][s.length-i-1];  
        }  
        //正向的(斜向下)  
        //比较,并输出字谜中的单词  
        outPutlogoGriph(temp,logogriph);  
    }  
    public static void main(String[] args){  
        //注意该方法只适用于规则的数组，即不允许String[][]s = new String[4][]这种不规则的数组;  
        String[][] s = new String[4][4];  
        s[0][0] = "t";  
        s[0][1] = "t";  
        s[0][2] = "i";  
        s[0][3] = "f";
          
        s[1][0] = "t";  
        s[1][1] = "h";  
        s[1][2] = "a";  
        s[1][3] = "o";  
          
        s[2][0] = "w";  
        s[2][1] = "t";  
        s[2][2] = "a";  
        s[2][3] = "w";  
          
        s[3][0] = "o";  
        s[3][1] = "s";  
        s[3][2] = "a";  
        s[3][3] = "t";  
        String[] logogriph = new String[]{"this","two","fat","that"};  
        getLogoGriph(s,logogriph);  
    }  