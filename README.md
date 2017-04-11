# tdop
Douglas Crockford's Top Down Operator Precedence parser, written in ES6

# notes
(0 "1" 0) (10 "+" 10) (0 "1" 0) (20 "*" 20) (0 "0" 0)
reduce: walk down the nodes in highest valued child first order and draw edges from small number to large number
(0 "1" 0) (10 "+" 10) (0 "1" 0) (20 "*" 20) (0 "0" 0)
(0 "1"->"+" 10) (0 "1" 0) (20 "*" 20) (0 "0" 0)
(0 "1"->"+"<-"1" 0) (20 "*" 20) (0 "0" 0)
("1"->"+"<-"1")->("*" 20) (0 "0" 0)
("1"->"+"<-"1")->("*"<-"0")
